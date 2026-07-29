
import { Mail, Linkedin, Twitter, Instagram, ShieldCheck, Scale, BadgeCheck, CalendarClock } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import logo from "@/assets/innoviaburst-logo.webp";
import { Button } from "@/components/ui/button";
import { PillBadge } from "@/components/ui/pill-badge";
import { openCookieSettings } from "@/components/CookieConsent";
import { NewsletterForm } from "@/components/NewsletterForm";
import { ORG_FACTS, hasAddress } from "@/seo/org-facts";
const footerLinkDefinitions = {
  company: [
    { labelKey: "footer.links.about", href: "/about" }, // Crawlable standalone page (Phase 7)
    { labelKey: "footer.links.offers", href: "/#offers" },
    { labelKey: "footer.links.solutions", href: "/#solutions" },
    { labelKey: "footer.links.industries", href: "/industries" }, // Crawlable standalone page
    { labelKey: "footer.links.work", href: "/works" }, // Crawlable standalone page
    { labelKey: "footer.links.automations", href: "/automations" },
    { labelKey: "footer.links.mvp", href: "/mvp-launch" }, // Dev/MVP pillar — link-equity parity
    { labelKey: "footer.links.training", href: "/training" }, // Training pillar — was nav-only
  ],
  resources: [
    { labelKey: "footer.links.trust", href: "/trust" },
    { labelKey: "footer.links.subprocessors", href: "/subprocessors" },
    { labelKey: "footer.links.resources", href: "/resources" }, // Crawlable standalone page
    { labelKey: "footer.links.contact", href: "/#contact" },
  ],
  legal: [
    { labelKey: "footer.links.privacy", href: "/privacy" },
    { labelKey: "footer.links.cookies", href: "/cookies" },
    { labelKey: "footer.links.terms", href: "/terms" },
    // Optional “Accessibility” page if/when you add it:
    // { labelKey: "footer.links.accessibility", href: "/accessibility" },
  ],
};

const socialLinkDefinitions = [
  {
    labelKey: "footer.social.email",
    href: "mailto:hello@innoviaburst.com",
    Icon: Mail,
    external: false,
  },
  {
    labelKey: "footer.social.linkedin",
    href: "https://www.linkedin.com/company/innoviaburst/?viewAsMember=true",
    Icon: Linkedin,
    external: true,
  },
  {
    labelKey: "footer.social.instagram",
    href: "https://www.instagram.com/innoviaburst/",
    Icon: Instagram,
    external: true,
  },
  {
    labelKey: "footer.social.twitter",
    href: "https://www.instagram.com/innoviaburst/",
    Icon: Twitter,
    external: true,
  },
];

/**
 * Compliance posture shown as a badge row.
 *
 * `pending: true` renders an explicit "in progress" qualifier — Cyber Essentials
 * is a placeholder until the certificate actually exists, and the badge says so
 * rather than implying a certification we don't hold (same honesty rule as the
 * CredibilityStrip placeholder under the hero).
 */
const complianceBadges = [
  { labelKey: "footer.compliance.gdpr", Icon: ShieldCheck, pending: false },
  { labelKey: "footer.compliance.aiAct", Icon: Scale, pending: false },
  { labelKey: "footer.compliance.cyberEssentials", Icon: BadgeCheck, pending: true },
];

function isInternal(href: string) {
  return href.startsWith("/");
}

/**
 * SPA-safe footer navigation link component
 * Handles hash links (/#section) properly with React Router
 * to avoid full page reloads
 */
function FooterNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Handle click for hash links to enable SPA navigation
  const handleHashLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Only intercept internal hash links like "/#offers"
    if (href.startsWith("/#")) {
      e.preventDefault();
      const hash = href.substring(1); // Remove leading "/"
      const sectionId = hash.substring(1); // Remove "#"
      
      // If we're already on the home page, just scroll to the section
      if (location.pathname === "/") {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        // Navigate to home page, then scroll after navigation
        navigate("/", { state: { scrollTo: sectionId } });
      }
    }
  };

  const linkClasses = "inline-flex items-center min-h-[44px] py-1 text-background/75 hover:text-background transition-colors hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background/60 focus-visible:ring-offset-2 focus-visible:ring-offset-foreground rounded";

  // Treat all "/..." links as internal, even if they contain "#"
  if (isInternal(href)) {
    // For hash links, use anchor with custom handler for SPA behavior
    if (href.includes("#")) {
      return (
        <a
          href={href}
          onClick={handleHashLinkClick}
          className={linkClasses}
        >
          {children}
        </a>
      );
    }
    
    return (
      <Link
        to={href}
        className={linkClasses}
      >
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={linkClasses}
    >
      {children}
    </a>
  );
}

interface FooterProps {
  /**
   * Opens the booking modal. Optional because the footer renders on ~20 pages
   * that don't mount one — without it the CTA falls back to SPA-navigating to
   * the homepage contact section, which carries the same booking entry point.
   */
  onBookingClick?: () => void;
}

export function Footer({ onBookingClick }: FooterProps = {}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const handleBookClick = () => {
    window.dispatchEvent(
      new CustomEvent("analytics", { detail: { event: "cta_click", location: "footer" } })
    );

    if (onBookingClick) {
      onBookingClick();
      return;
    }

    if (location.pathname === "/") {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/", { state: { scrollTo: "contact" } });
    }
  };

  const footerLinks = useMemo(
    () => ({
      company: footerLinkDefinitions.company.map((link) => ({
        ...link,
        label: t(link.labelKey),
      })),
      resources: footerLinkDefinitions.resources.map((link) => ({
        ...link,
        label: t(link.labelKey),
      })),
      legal: footerLinkDefinitions.legal.map((link) => ({
        ...link,
        label: t(link.labelKey),
      })),
    }),
    [t]
  );

  const socialLinks = useMemo(
    () =>
      socialLinkDefinitions.map((link) => ({
        ...link,
        label: t(link.labelKey),
      })),
    [t]
  );

  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-16 pb-24 bg-foreground text-background">
      {/* Extra bottom padding for sticky CTA bar */}
      <div className="container mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 lg:gap-12 mb-12">
          {/* Logo & Info */}
          <div className="sm:col-span-2 lg:col-span-2 space-y-6">
            {/* Logo + one-line identity blurb beside it (wraps under on narrow) */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <img
                src={logo}
                alt="InnoviaBurst"
                width={256}
                height={256}
                className="h-12 w-auto brightness-0 invert"
                loading="lazy"
              />
              <p className="text-sm text-background/70 leading-snug max-w-[15rem]">
                {t("footer.blurb")}
              </p>
            </div>

            <p className="text-background/75 max-w-sm leading-relaxed">
              {t("footer.description")}
            </p>

            {/* Compliance posture — PillBadge restyled for the dark footer surface */}
            <ul
              className="flex flex-wrap items-center gap-2"
              aria-label={t("footer.compliance.label")}
            >
              {complianceBadges.map(({ labelKey, Icon, pending }) => (
                <li key={labelKey}>
                  <PillBadge
                    variant="neutral"
                    className="border-background/15 bg-background/5 text-background/80"
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>{t(labelKey)}</span>
                    {/* /50 measured 4.46:1 on this pill — /65 clears the 4.5 AA floor */}
                    {pending && (
                      <span className="text-background/65">· {t("footer.compliance.inProgress")}</span>
                    )}
                  </PillBadge>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3">
              {socialLinks.map(({ label, href, Icon, external }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  title={label}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="w-12 h-12 flex justify-center items-center rounded-xl border border-background/10 bg-background/5 hover:bg-background/10 hover:border-background/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background/60 focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
                >
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </a>
              ))}
            </div>

            <p className="text-sm text-background/55">
              {t("footer.remoteFirst")}
            </p>
          </div>

          {/* Company Links */}
          <nav aria-label={t("footer.company")}
            className="space-y-4">
            <h3 className="font-semibold">{t("footer.company")}</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <FooterNavLink href={link.href}>{link.label}</FooterNavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Resources Links */}
          <nav aria-label={t("footer.resources")}
            className="space-y-4">
            <h3 className="font-semibold">{t("footer.resources")}</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <FooterNavLink href={link.href}>{link.label}</FooterNavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal Links */}
          <nav aria-label={t("footer.legal")}
            className="space-y-4">
            <h3 className="font-semibold">{t("footer.legal")}</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <FooterNavLink href={link.href}>{link.label}</FooterNavLink>
                </li>
              ))}

              <li>
                <button
                  onClick={openCookieSettings}
                  className="inline-flex items-center min-h-[44px] py-1 text-background/75 hover:text-background transition-colors hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background/60 focus-visible:ring-offset-2 focus-visible:ring-offset-foreground rounded"
                >
                  {t("footer.cookieSettings")}
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Newsletter + booking CTA — paired so the desktop row isn't half empty */}
        <div className="py-8 border-t border-background/10 mb-8 grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="max-w-md">
            <NewsletterForm
              placement="footer"
              shortConsent
              headline={t("newsletter.default.footer.headline")}
              description={t("newsletter.default.footer.description")}
              buttonText={t("newsletter.cta.subscribe")}
            />
          </div>

          <div className="rounded-2xl border border-background/10 bg-background/5 p-6 lg:justify-self-end lg:max-w-md">
            <h3 className="flex items-center gap-2 font-semibold text-background">
              <CalendarClock className="w-5 h-5 shrink-0 text-background/70" aria-hidden="true" />
              {t("footer.booking.headline")}
            </h3>
            <p className="mt-2 text-sm text-background/70 leading-relaxed">
              {t("footer.booking.description")}
            </p>
            <Button
              variant="cta"
              size="lg"
              onClick={handleBookClick}
              className="mt-4 w-full sm:w-auto"
            >
              {t("footer.booking.cta")}
            </Button>
          </div>
        </div>

        {/* Company disclosure — driven by src/seo/org-facts.ts (Phase 7). Renders
            only once a real legalName is supplied, and stays consistent with the
            Organization schema's legalName. Nothing is shown while unset. */}
        {ORG_FACTS.legalName && (
          <div className="py-4 border-t border-background/10 mb-4">
            <p className="text-xs text-background/55 text-center">
              {ORG_FACTS.legalName}
              {ORG_FACTS.taxId ? `, ${t("footer.companyNo")} ${ORG_FACTS.taxId}` : ""}
              {hasAddress()
                ? `, ${t("footer.registeredOffice")}: ${[
                    ORG_FACTS.address.streetAddress,
                    ORG_FACTS.address.addressLocality,
                    ORG_FACTS.address.addressRegion,
                    ORG_FACTS.address.postalCode,
                    ORG_FACTS.address.addressCountry,
                  ]
                    .filter(Boolean)
                    .join(", ")}`
                : ""}
            </p>
          </div>
        )}

        {/* Bottom Bar */}
        <div className="pt-4 border-t border-background/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-background/55">
            {t("footer.bottom.copyright", { year: currentYear })}
          </p>
          <p className="text-sm text-background/55">
            {t("footer.bottom.privacyNote")}
          </p>
        </div>
      </div>
    </footer>
  );
}
