export { Page };

// Body of the pre-rendered root shell (dist/client/index.html). Visitors never
// really see it — the inline <head> script replaces the URL during parse — so it
// is deliberately dependency-free (no app CSS, no AppShell): just a legible
// fallback for the split second before the redirect, for no-JS visitors during
// the 1s <meta refresh>, and for crawlers, which get two real locale links.
function Page() {
  return (
    <div
      style={{
        fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        margin: 0,
        gap: "0.75rem",
        color: "#0f172a",
        background: "#ffffff",
      }}
    >
      <p style={{ margin: 0, fontSize: "1rem" }}>Redirecting…</p>
      <p style={{ margin: 0, fontSize: "0.875rem" }}>
        <a href="/en/" hrefLang="en" lang="en" style={{ color: "#2563eb" }}>
          English
        </a>
        {" · "}
        <a href="/fr/" hrefLang="fr" lang="fr" style={{ color: "#2563eb" }}>
          Français
        </a>
      </p>
    </div>
  );
}
