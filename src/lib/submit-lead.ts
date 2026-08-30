/**
 * The one place a lead leaves the browser.
 *
 * Every form on the site used to hand-roll its own submit, which is why they
 * drifted apart — three input styles, two email regexes, one form with no
 * consent checkbox, and all of them resolving a `setTimeout` and then claiming
 * success. This is the single transport they now share.
 *
 * Transport is EmailJS. The site is a static bundle with no backend, and a
 * browser cannot open an SMTP connection, so the send is brokered: EmailJS
 * holds an OAuth connection to the Gmail account (set up once in their
 * dashboard) and relays through it. The mail genuinely comes from that account,
 * and no credential of ours exists in this bundle — which is the point. There
 * is no App Password to leak, because there is no App Password.
 *
 * The three VITE_EMAILJS_* values ARE public, deliberately: the public key can
 * only trigger the template we defined, with the content we defined. What
 * actually stops another site spending our quota is the origin allowlist in the
 * EmailJS dashboard, under Domains. Set it.
 *
 * The email body is built HERE rather than in an EmailJS template, and passed
 * as a single `message` variable. Their templates are flat variable
 * substitution, and our four lead types carry different field sets — one
 * pre-rendered block keeps all of them legible without needing a template per
 * type (the free plan allows two).
 */

import emailjs from "@emailjs/browser";

const SERVICE_ID = (import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined) ?? "";
const TEMPLATE_ID = (import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined) ?? "";
const PUBLIC_KEY = (import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined) ?? "";

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
 * exists so missing keys surface as a visible error instead of the silent
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

/** Reads better than `booking` in an inbox subject line. */
const TYPE_LABEL: Record<LeadType, string> = {
  booking: "booking request",
  request: "scope request",
  training: "training enquiry",
  newsletter: "newsletter signup",
};

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

/** The readable block the template prints as {{message}}. */
function buildMessage(payload: LeadPayload): string {
  const { extra, ...fields } = payload;
  const rows: Array<[string, string]> = [];
  const push = (k: string, v: unknown) => {
    if (v === undefined || v === null || v === "") return;
    rows.push([FIELD_LABEL[k] ?? humanise(k), String(v)]);
  };

  for (const [k, v] of Object.entries(fields)) push(k, v);
  if (extra) for (const [k, v] of Object.entries(extra)) push(k, v);
  push("sourcePath", typeof window !== "undefined" ? window.location.pathname : "");
  rows.push(["Received", new Date().toISOString()]);

  const width = Math.max(...rows.map(([l]) => l.length));
  return rows.map(([l, v]) => `${l.padEnd(width)}  ${v}`).join("\n");
}

export async function submitLead(payload: LeadPayload): Promise<LeadResult> {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    // Loud in dev, silent in prod — but either way the caller shows an error
    // rather than a success screen.
    if (import.meta.env.DEV) {
      console.warn(
        "[submitLead] VITE_EMAILJS_SERVICE_ID / _TEMPLATE_ID / _PUBLIC_KEY are not " +
          "all set — the lead was NOT sent.",
      );
    }
    return { ok: false, reason: "not_configured" };
  }

  /**
   * Template variables. Keep these names in sync with the EmailJS template:
   * {{subject}}, {{from_name}}, {{reply_to}}, {{lead_type}}, {{message}}.
   * `reply_to` is the one that matters day to day — it makes Reply in your
   * inbox answer the person who filled the form.
   */
  const params = {
    subject: `New ${TYPE_LABEL[payload.type]} — ${payload.name || payload.email}`,
    from_name: payload.name || payload.email,
    reply_to: payload.email,
    lead_type: payload.type,
    message: buildMessage(payload),
  };

  try {
    const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, params, {
      publicKey: PUBLIC_KEY,
    });
    // The SDK rejects on failure, so reaching here with a 2xx is a real send.
    if (response.status >= 200 && response.status < 300) return { ok: true };
    return { ok: false, reason: "server", status: response.status };
  } catch (err) {
    // EmailJSResponseStatus carries a numeric status; a genuine network failure
    // does not. Distinguishing them keeps the caller's message honest.
    const status = (err as { status?: number })?.status;
    if (typeof status === "number" && status > 0) {
      return { ok: false, reason: "server", status };
    }
    return { ok: false, reason: "network" };
  }
}

/** True when all three EmailJS values are present. */
export const isLeadCaptureConfigured = (): boolean =>
  SERVICE_ID !== "" && TEMPLATE_ID !== "" && PUBLIC_KEY !== "";
