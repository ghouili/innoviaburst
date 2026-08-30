/**
 * Lead-capture endpoint.
 *
 * The site is a static bundle served by nginx, so it cannot send email itself:
 * browsers cannot open an SMTP connection, and any credential shipped to the
 * browser is public. This process exists to hold the SMTP credentials and do
 * the sending, behind nginx's /api/ proxy.
 *
 * Deliberately dependency-light — node:http plus nodemailer, matching the
 * plain-node precedent in scripts/preview-server.mjs. No framework.
 */

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import nodemailer from "nodemailer";

const HERE = path.dirname(fileURLToPath(import.meta.url));

/* ------------------------------------------------------------------ config */

/**
 * Tiny .env reader. Avoids a dotenv dependency and, more importantly, avoids
 * relying on pm2 to inject env — pm2 replays the environment a process was
 * FIRST created with, which is the same footgun deploy.sh already documents
 * for its static server.
 */
function loadEnvFile(file) {
  if (!fs.existsSync(file)) return;
  for (const raw of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    const quoted =
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"));
    if (quoted) value = value.slice(1, -1);
    // Real environment wins, so a deploy can override the file.
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

loadEnvFile(path.join(HERE, ".env"));

const PORT = Number(process.env.PORT || 3000);

const MAIL_HOST = process.env.MAIL_HOST || "smtp.gmail.com";
const MAIL_PORT = Number(process.env.MAIL_PORT || 587);

/**
 * Implicit TLS. Port 465 is secure from the first byte; 587 is STARTTLS, which
 * connects in the clear and upgrades. Setting this true on 587 makes the
 * connection hang, so when unset it is derived from the port rather than
 * guessed.
 */
const MAIL_SECURE =
  process.env.MAIL_SECURE !== undefined && process.env.MAIL_SECURE !== ""
    ? /^(1|true|yes|on)$/i.test(process.env.MAIL_SECURE.trim())
    : MAIL_PORT === 465;

const MAIL_USER = process.env.MAIL_USER || "";
const MAIL_PASS = process.env.MAIL_PASS || "";

/**
 * Gmail rewrites From: to the authenticated account unless the address is a
 * verified alias on it ("Settings → Accounts → Send mail as"). Defaults to
 * MAIL_USER so the header matches what actually gets sent.
 */
const MAIL_FROM_ADDRESS = process.env.MAIL_FROM_ADDRESS || MAIL_USER;
const MAIL_FROM_NAME = process.env.MAIL_FROM_NAME || "InnoviaBurst website";

/**
 * Optional override. Left EMPTY (recommended) the reply-to is the address the
 * visitor typed, so hitting Reply in your inbox answers the lead directly. Set
 * it only if every reply should instead go to one fixed mailbox.
 */
const MAIL_REPLY_TO = process.env.MAIL_REPLY_TO || "";

/** Where notifications are delivered. Defaults to the sending account. */
const MAIL_TO = process.env.MAIL_TO || MAIL_USER;

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGIN || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

if (!MAIL_USER || !MAIL_PASS) {
  console.error(
    "[lead-api] MAIL_USER and MAIL_PASS are required. Copy server/.env.example " +
      "to server/.env and fill it in. Refusing to start — silently not sending " +
      "is how leads got lost in the first place.",
  );
  process.exit(1);
}

/* ------------------------------------------------------------------- mailer */

const transporter = nodemailer.createTransport({
  host: MAIL_HOST,
  port: MAIL_PORT,
  secure: MAIL_SECURE,
  auth: { user: MAIL_USER, pass: MAIL_PASS },
});

/* -------------------------------------------------------------- rate limit */

/**
 * The endpoint is public, so it needs a brake. In-memory is fine here: one
 * process behind nginx, and a restart clearing the window is not a meaningful
 * weakness for this threat model.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const seen = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  seen.push(now);
  hits.set(ip, seen);
  if (hits.size > 5000) {
    // Cheap sweep so a flood of unique IPs cannot grow the map forever.
    for (const [k, v] of hits) {
      if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
    }
  }
  return seen.length > MAX_PER_WINDOW;
}

/* --------------------------------------------------------------- formatting */

const TYPE_LABEL = {
  booking: "booking request",
  request: "scope request",
  training: "training enquiry",
  newsletter: "newsletter signup",
};

const FIELD_LABEL = {
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

const humanise = (key) => {
  const spaced = key.replace(/([a-z0-9])([A-Z])/g, "$1 $2").toLowerCase();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
};

const HTML_ESCAPES = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};
const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => HTML_ESCAPES[c]);

function buildEmail(lead) {
  const { extra, ...fields } = lead;
  const rows = [];
  const push = (k, v) => {
    if (v === undefined || v === null || v === "") return;
    rows.push([FIELD_LABEL[k] ?? humanise(k), Array.isArray(v) ? v.join(", ") : String(v)]);
  };

  for (const [k, v] of Object.entries(fields)) push(k, v);
  if (extra && typeof extra === "object") {
    for (const [k, v] of Object.entries(extra)) push(k, v);
  }
  rows.push(["Received", new Date().toISOString()]);

  const width = Math.max(...rows.map(([l]) => l.length));
  const text = rows.map(([l, v]) => `${l.padEnd(width)}  ${v}`).join("\n");

  const cells = rows
    .map(
      ([l, v]) =>
        `<tr><td style="padding:4px 14px 4px 0;color:#5B6B7C;vertical-align:top;white-space:nowrap">${escapeHtml(l)}</td>` +
        `<td style="padding:4px 0;color:#16202B">${escapeHtml(v).replace(/\n/g, "<br>")}</td></tr>`,
    )
    .join("");
  const html = `<table style="border-collapse:collapse;font-family:system-ui,sans-serif;font-size:14px">${cells}</table>`;

  return { text, html };
}

/* ------------------------------------------------------------- validation */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FIELD = 5000;

function validate(lead) {
  if (!lead || typeof lead !== "object") return "malformed body";
  if (!TYPE_LABEL[lead.type]) return "unknown lead type";
  if (typeof lead.email !== "string" || !EMAIL_RE.test(lead.email)) return "invalid email";
  for (const [k, v] of Object.entries(lead)) {
    if (typeof v === "string" && v.length > MAX_FIELD) return `field too long: ${k}`;
  }
  return null;
}

/* ----------------------------------------------------------------- server */

const MAX_BODY_BYTES = 16 * 1024;

function send(res, status, payload, origin) {
  const headers = { "Content-Type": "application/json", "Cache-Control": "no-store" };
  if (origin) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers.Vary = "Origin";
  }
  res.writeHead(status, headers);
  res.end(JSON.stringify(payload));
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const origin = req.headers.origin;
  // Same-origin requests (the normal path, via nginx) carry no Origin and need
  // no CORS header at all.
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : null;

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": allowedOrigin || "null",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
      Vary: "Origin",
    });
    return res.end();
  }

  if (req.method === "GET" && url.pathname === "/api/health") {
    return send(res, 200, { ok: true, uptime: Math.round(process.uptime()) });
  }

  if (req.method !== "POST" || url.pathname !== "/api/leads") {
    return send(res, 404, { ok: false, error: "not_found" });
  }

  // A cross-origin post is rejected outright when an allowlist is configured.
  if (ALLOWED_ORIGINS.length && origin && !allowedOrigin) {
    return send(res, 403, { ok: false, error: "forbidden_origin" });
  }

  const forwarded = String(req.headers["x-forwarded-for"] || "");
  const ip = forwarded.split(",")[0].trim() || req.socket.remoteAddress || "unknown";
  if (rateLimited(ip)) {
    return send(res, 429, { ok: false, error: "rate_limited" }, allowedOrigin);
  }

  let raw = "";
  let tooBig = false;
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > MAX_BODY_BYTES) {
      tooBig = true;
      break;
    }
  }
  if (tooBig) return send(res, 413, { ok: false, error: "payload_too_large" }, allowedOrigin);

  let lead;
  try {
    lead = JSON.parse(raw);
  } catch {
    return send(res, 400, { ok: false, error: "invalid_json" }, allowedOrigin);
  }

  // Honeypot: a real form never fills this. Answer 200 so a bot learns nothing.
  if (lead && typeof lead._gotcha === "string" && lead._gotcha.trim() !== "") {
    console.warn(`[lead-api] honeypot tripped from ${ip}`);
    return send(res, 200, { ok: true }, allowedOrigin);
  }
  if (lead && typeof lead === "object") delete lead._gotcha;

  const invalid = validate(lead);
  if (invalid) {
    console.warn(`[lead-api] rejected from ${ip}: ${invalid}`);
    return send(res, 422, { ok: false, error: "validation_failed" }, allowedOrigin);
  }

  const { text, html } = buildEmail(lead);
  const subject = `New ${TYPE_LABEL[lead.type]} — ${lead.name || lead.email}`;

  try {
    await transporter.sendMail({
      from: { name: MAIL_FROM_NAME, address: MAIL_FROM_ADDRESS },
      to: MAIL_TO,
      // Unless overridden, reply goes to the person who filled the form rather
      // than to this mailbox — that is the whole point of the notification.
      replyTo: MAIL_REPLY_TO || lead.email,
      subject,
      text,
      html,
    });
  } catch (err) {
    // Log the detail here; return nothing that reveals the mail configuration.
    console.error(`[lead-api] send failed for ${lead.type} from ${ip}:`, err?.message || err);
    return send(res, 502, { ok: false, error: "send_failed" }, allowedOrigin);
  }

  console.log(`[lead-api] sent ${lead.type} from ${lead.email}`);
  return send(res, 200, { ok: true }, allowedOrigin);
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(
    `[lead-api] listening on 127.0.0.1:${PORT} — ${MAIL_HOST}:${MAIL_PORT} ` +
      `(secure=${MAIL_SECURE}) delivering to ${MAIL_TO}`,
  );
});
