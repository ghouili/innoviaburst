import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { SeoHead, buildAlternates } from "@/components/SeoHead";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EmptyState } from "@/components/ui/empty-state";
import { PillBadge } from "@/components/ui/pill-badge";
import { FileQuestion, Zap, Briefcase, Shield, BookOpen, Home } from "lucide-react";

const NotFound = () => {
  const { t } = useTranslation();

  const quickLinks = [
    { label: t("nav.automations"), href: "/automations", icon: Zap },
    { label: t("nav.offers"), href: "/offers", icon: Briefcase },
    { label: t("nav.trust"), href: "/trust", icon: Shield },
    { label: t("nav.resources"), href: "/resources", icon: BookOpen },
  ];

  return (
    <>
      <SeoHead
        title={t("notFound.seo.title")}
        description={t("notFound.seo.description")}
        canonicalPath="/404"
        alternates={buildAlternates("/404")}
        robots="noindex, nofollow"
      />

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus:shadow-lg"
      >
        {t("common.skipLink")}
      </a>

      <Navbar />

      <main
        id="main-content"
        className="flex min-h-[80vh] flex-col items-center justify-center bg-gradient-hero px-4"
      >
        {/* Background glow */}
        <div
          className="absolute inset-0 bg-gradient-glow pointer-events-none"
          aria-hidden="true"
        />

        <EmptyState
          icon={FileQuestion}
          title={t("notFound.title")}
          description={t("notFound.description")}
          size="large"
          primaryCta={{
            label: t("common.backToHome"),
            href: "/",
          }}
          secondaryCta={{
            label: t("nav.seeAutomations"),
            href: "/automations",
          }}
        >
          {/* Quick Links */}
          <div className="mt-10">
            <p className="mb-4 text-sm font-medium text-muted-foreground">
              {t("notFound.popularPages")}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {quickLinks.map((link) => (
                <Link key={link.href} to={link.href}>
                  <PillBadge
                    variant="neutral"
                    size="lg"
                    className="cursor-pointer hover:bg-muted/80 transition-colors"
                  >
                    <link.icon className="h-3.5 w-3.5" aria-hidden="true" />
                    {link.label}
                  </PillBadge>
                </Link>
              ))}
              <Link to="/">
                <PillBadge
                  variant="category"
                  size="lg"
                  className="cursor-pointer hover:bg-secondary/20 transition-colors"
                >
                  <Home className="h-3.5 w-3.5" aria-hidden="true" />
                  {t("notFound.home")}
                </PillBadge>
              </Link>
            </div>
          </div>
        </EmptyState>
      </main>

      <Footer />
    </>
  );
};

export default NotFound;
