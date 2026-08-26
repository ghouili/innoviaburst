import { useTranslation } from "react-i18next";
import { Shield, Users, Clock, Eye, Download, ArrowRight, FileText, Siren } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Trust item keys for i18n lookup
const trustItemKeys = [
  { key: "access", icon: Shield },
  { key: "subprocessors", icon: Users },
  { key: "retention", icon: Clock },
  { key: "incident", icon: Siren },
  { key: "dpa", icon: FileText },
  { key: "ai", icon: Eye },
];

export function TrustSection() {
  const { t } = useTranslation();

  const handleDownloadClick = () => {
    window.dispatchEvent(
      new CustomEvent("analytics", { detail: { event: "trust_pack_download" } })
    );
  };

  return (
    <section id="trust" className="py-20 lg:py-28 bg-background border-2">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
            {t("trust.title", "Trust &")} <span className="text-gradient-brand">{t("trust.titleHighlight", "Compliance")}</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            {t("trust.subtitle", "Security and compliance aren't afterthoughts  they're built in from day one.")}
          </p>
        </div>

        {/* Trust Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trustItemKeys.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.key}
                className="p-6 bg-card rounded-2xl border border-border shadow-card hover:shadow-card-hover transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-muted w-fit">
                    <IconComponent className="w-6 h-6 text-secondary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">
                    {t(`trust.items.${item.key}.title`)}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(`trust.items.${item.key}.description`)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center space-y-3 pt-14">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" asChild className="w-full sm:w-auto min-h-[48px]">
              <Link to="/trust">
                {t("trust.viewPage", "View full Trust & Compliance page")}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>

            <Button variant="outline" size="lg" onClick={handleDownloadClick} asChild className="w-full sm:w-auto min-h-[48px]">
              <a href="/trust-pack.pdf" download>
                <Download className="w-4 h-4 mr-2" />
                {t("trust.downloadPack", "Download Trust Pack (PDF)")}
              </a>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            {t("trust.disclaimer", "Not legal advice. For compliance questions, consult a qualified legal professional.")}
          </p>
        </div>
      </div>
    </section>
  );
}
