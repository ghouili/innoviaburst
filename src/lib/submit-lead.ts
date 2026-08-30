/**
 * The one place a lead leaves the browser.
 *
 * Every form on the site used to hand-roll its own submit, which is why they
 * drifted apart — three input styles, two email regexes, one form with no
 * consent checkbox, and all six resolving a `setTimeout` and then claiming
 * success. This is the single transport they now share.
 *
 * Transport is Web3Forms: the site is a static bundle served by nginx with no
 * backend, so the POST goes straight from the browser to the service, which
 * emails the lead. The access key is public by design (it identifies a form,
 * not an account), which is the only reason it can live in a VITE_ variable.
 *
 * The payload keys deliberately match the `leads` schema in
 * docs/lovable-input.json, so pointing this at a first-party /api/leads later
 * is a one-line change to ENDPOINT.
 */

const ENDPOINT = "https://api.web3forms.com/submit";

const ACCESS_KEY = (import.meta.env.VITE_FORMS_ACCESS_KEY as string | undefined) ?? "";

export type LeadType = "booking" | "request" | "training" | "newsletter";

export interface LeadPayload {
  type: LeadType;
  email: string;
  name?: string;
  company?: string;
  role?: string;
  goal?: string;
  /** Pre-filled subject from the page the visitor came from. */
  interestedIn?: string;
  message?: string;
  /** Which surface submitted it, e.g. "booking_modal", "footer". */
  source?: string;
  consent?: boolean;
  consentVersion?: string;
  consentText?: string;
  /** Form-specific fields that do not fit the shared shape. */
  extra?: Record<string, string | number | boolean | undefined>;
}

export type LeadFailure = "not_configured" | "network" | "server";

/**
 * Never throws, and never reports success it cannot verify. `not_configured`
 * exists so a missing key surfaces as a visible error instead of the silent
 * fake-success the newsletter hook used to do.
 *
 * Deliberately a flat shape rather than a discriminated union: this project
 * compiles with `strict: false`, under which narrowing on a boolean literal
 * discriminant does not work, so `result.reason` would not type-check in the
 * else branch.
 */
export interface LeadResult {
  ok: boolean;
  reason?: LeadFailure;
  status?: number;
}

/** Reads better than `booking` in a Gmail subject line. */
const TYPE_LABEL: Record<LeadType, string> = {
  booking: "booking request",
  request: "scope request",
  training: "training enquiry",
  newsletter: "newsletter signup",
};

/**
 * Web3Forms renders whatever keys it receives, verbatim, as the email body. So
 * the keys ARE the email's field labels — `sourcePath` would reach the inbox as
 * "sourcePath". This maps the structured payload onto readable labels at the
 * transport boundary only: LeadPayload and every call site keep the machine
 * names, which is what keeps a later swap to /api/leads a one-line change.
 */
const FIELD_LABEL: Record<string, string> = {
  type: "Type",
  name: "Name",
  email: "Email",
  company: "Company",
  role: "Role",
  goal: "What they want to automate",
  interestedIn: "Came from",
  message: "Message",
  source: "Form",
  consent: "Marketing consent",
  consentVersion: "Consent version",
  consentText: "Consent text shown",
  sourcePath: "Page",
  leadMagnet: "Lead magnet",
  tools: "Tools they use",
  timeline: "Timeline",
  tracks: "Tracks",
  format: "Format",
  teamSize: "Team size",
  timeframe: "Timeframe",
  preferredDates: "Preferred dates",
  delivers: "What they deliver",
  accreditations: "Accreditations",
  variant: "A/B variant",
};

/** Fallback for any key without an explicit label: camelCase -> Sentence case. */
function humanise(key: string): string {
  const spaced = key.replace(/([a-z0-9])([A-Z])/g, "$1 $2").toLowerCase();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function buildBody(payload: LeadPayload): Record<string, unknown> {
  const { extra, ...fields } = payload;

  const body: Record<string, unknown> = {
    access_key: ACCESS_KEY,
    // Scannable in a Gmail list view: what it is, then who it is from.
    subject: `New ${TYPE_LABEL[payload.type]} — ${payload.name || payload.email}`,
    from_name: "InnoviaBurst website",
    // Reserved Web3Forms field. Without it, hitting Reply in Gmail replies to
    // Web3Forms rather than to the person who filled the form. It defaults to
    // whatever `email` holds, but set it explicitly so that cannot drift.
    replyto: payload.email,
  };

  const put = (key: string, value: unknown) => {
    if (value === undefined || value === null || value === "") return;
    body[FIELD_LABEL[key] ?? humanise(key)] = value;
  };

  for (const [k, v] of Object.entries(fields)) put(k, v);
  if (extra) for (const [k, v] of Object.entries(extra)) put(k, v);

  // Context last, so the human fields lead.
  put("sourcePath", typeof window !== "undefined" ? window.location.pathname : "");
  body["Submitted"] = new Date().toISOString();

  return body;
}

export async function submitLead(payload: LeadPayload): Promise<LeadResult> {
  if (!ACCESS_KEY) {
    // Loud in dev, silent in prod — but either way the caller shows an error
    // rather than a success screen.
    if (import.meta.env.DEV) {
      console.warn("[submitLead] VITE_FORMS_ACCESS_KEY is not set — the lead was NOT sent.");
    }
    return { ok: false, reason: "not_configured" };
  }

  let response: Response;
  try {
    response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(buildBody(payload)),
    });
  } catch {
    // Offline, DNS failure, blocked by an extension.
    return { ok: false, reason: "network" };
  }

  if (!response.ok) return { ok: false, reason: "server", status: response.status };

  // A 200 is not sufficient — Web3Forms reports validation failures in the body.
  const data = (await response.json().catch(() => null)) as { success?: boolean } | null;
  if (!data?.success) return { ok: false, reason: "server", status: response.status };

  return { ok: true };
}

/** True when a key is configured, for callers that want to hide a dead form. */
export const isLeadCaptureConfigured = (): boolean => ACCESS_KEY !== "";
