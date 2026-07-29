import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logo from "@/assets/innoviaburst-logo.webp";
import { openCookieSettings } from "@/components/CookieConsent";
import { ORG_FACTS, hasAddress, hasSecondaryAddress } from "@/seo/org-facts";

/**
 * Minimal landing-page footer: brand + legal essentials only (privacy, cookies,
 * terms, cookie settings) plus the company disclosure line. No Company /
 * Resources / Legal columns and no newsletter — nothing that pulls cold ad
 * traffic away from the offer.
 */
export function LpFooter() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const legalLinks = [
    { label: t("footer.links.privacy"), href: "/privacy" },
    { label: t("footer.links.cookies"), href: "/cookies" },
    { label: t("footer.links.terms"), href: "/terms" },
  ];

  const linkClasses =
    "text-sm text-background/70 transition-colors hover:text-background hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background/60 focus-visible:ring-offset-2 focus-visible:ring-offset-foreground rounded";

  return (
    <footer className="bg-foreground pb-24 pt-14 text-background">
      {/* pb-24 keeps content clear of the sticky CTA bar */}
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <img
              src={logo}
              alt="InnoviaBurst"
              width={256}
              height={256}
              className="h-10 w-auto brightness-0 invert"
              loading="lazy"
            />
            <p className="max-w-sm text-sm text-background/70">{t("lpMvp.footer.tagline")}</p>
          </div>

          <nav aria-label={t("footer.legal")} className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {legalLinks.map((link) => (
              <Link key={link.href} to={link.href} className={linkClasses}>
                {link.label}
              </Link>
            ))}
            <button type="button" onClick={openCookieSettings} className={linkClasses}>
              {t("footer.cookieSettings")}
            </button>
          </nav>
        </div>

        {/* Company disclosure — same source of truth as the main footer /
            Organization schema; renders only once a real legalName is set. */}
        {ORG_FACTS.legalName && (
          <p className="mt-8 border-t border-background/10 pt-6 text-xs text-background/55">
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
            {hasSecondaryAddress()
              ? `. ${t("footer.alsoAt")}: ${[
                  ORG_FACTS.secondaryAddress!.streetAddress,
                  ORG_FACTS.secondaryAddress!.addressLocality,
                  ORG_FACTS.secondaryAddress!.addressCountry,
                ]
                  .filter(Boolean)
                  .join(", ")}`
              : ""}
          </p>
        )}

        <p className={`${ORG_FACTS.legalName ? "mt-4" : "mt-8 border-t border-background/10 pt-6"} text-sm text-background/55`}>
          {t("footer.bottom.copyright", { year: currentYear })}
        </p>
      </div>
    </footer>
  );
}
