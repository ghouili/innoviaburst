import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EmptyState } from "@/components/ui/empty-state";
import { PillBadge } from "@/components/ui/pill-badge";
import { FileQuestion, Zap, Briefcase, Shield, BookOpen, Home } from "lucide-react";

const quickLinks = [
  { label: "Automations", href: "/automations", icon: Zap },
  { label: "Offers", href: "/offers", icon: Briefcase },
  { label: "Trust", href: "/trust", icon: Shield },
  { label: "Resources", href: "/resources", icon: BookOpen },
];

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>Page Not Found | InnoviaBurst</title>
        <meta
          name="description"
          content="The page you're looking for doesn't exist or may have moved."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus:shadow-lg"
      >
        Skip to main content
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
          title="Page not found"
          description="The page you're looking for doesn't exist or may have moved. Let's get you back on track."
          size="large"
          primaryCta={{
            label: "Back to home",
            href: "/",
          }}
          secondaryCta={{
            label: "See automations",
            href: "/automations",
          }}
        >
          {/* Quick Links */}
          <div className="mt-10">
            <p className="mb-4 text-sm font-medium text-muted-foreground">
              Popular pages
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
                  Home
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
