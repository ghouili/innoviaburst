/**
 * The one place a lead leaves the browser.
 *
 * Every form on the site used to hand-roll its own submit, which is why they
 * drifted apart — three input styles, two email regexes, one form with no
 * consent checkbox, and all six resolving a `setTimeout` and then claiming
 * success. This is the single transport they now share.
 *
 * There are two transports, and which one runs is decided by configuration:
 *
 *  1. DEFAULT — our own /api/leads on the VPS (server/index.mjs), proxied by
 *     nginx. It holds the SMTP credentials and sends through Gmail. This is
 *     the only way the mail can come from our own account: a browser cannot
 *     open an SMTP connection, and any credential given to a VITE_ variable
 *     is inlined into this bundle for anyone to read.
 *
 *  2. FALLBACK — Web3Forms, used only when VITE_FORMS_ACCESS_KEY is set. No
 *     server required. Its access key is public by design (it identifies a
 *     form, not an account), which is why that one key may live in a VITE_
 *     variable when nothing else may.
 *
 * The payload keys match the `leads` schema in docs/lovable-input.json. Our
 * own endpoint receives them as-is and does the email formatting server-side;
 * the Web3Forms path has to relabel them here, because that service renders
 * whatever keys it receives directly into the email body.
 */

const OWN_ENDPOINT = (import.meta.env.VITE_LEAD_ENDPOINT as string | undefined) || "/api/leads";
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

const ACCESS_KEY = (import.meta.env.VITE_FORMS_ACCESS_KEY as string | undefined) ?? "";

/** Web3Forms only when a key is configured; our own endpoint otherwise. */
const useWeb3Forms = ACCESS_KEY !== "";
const ENDPOINT = useWeb3Forms ? WEB3FORMS_ENDPOINT : OWN_ENDPOINT;

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

/**
 * Our own endpoint gets the structured payload untouched — server/index.mjs
 * owns the labelling, so the wire format stays machine-readable.
 * `_gotcha` is a honeypot the server checks; a real form never fills it.
 */
function buildOwnBody(payload: LeadPayload): Record<string, unknown> {
  return {
    ...payload,
    sourcePath: typeof window !== "undefined" ? window.location.pathname : "",
    _gotcha: "",
  };
}

function buildWeb3FormsBody(payload: LeadPayload): Record<string, unknown> {
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

  let response: Response;
  try {
    response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(useWeb3Forms ? buildWeb3FormsBody(payload) : buildOwnBody(payload)),
    });
  } catch {
    // Offline, DNS failure, blocked by an extension.
    return { ok: false, reason: "network" };
  }

  if (!response.ok) return { ok: false, reason: "server", status: response.status };

  // A 200 alone is not sufficient: both transports report failures in the body
  // (Web3Forms as `success`, ours as `ok`).
  const data = (await response.json().catch(() => null)) as
    | { success?: boolean; ok?: boolean }
    | null;
  const accepted = useWeb3Forms ? data?.success : data?.ok;
  if (!accepted) return { ok: false, reason: "server", status: response.status };

  return { ok: true };
}

/**
 * Whether a transport exists at all. Our own endpoint is always considered
 * configured — if it is not deployed the POST 404s and the caller shows an
 * error, which is the honest outcome.
 */
export const isLeadCaptureConfigured = (): boolean => true;
