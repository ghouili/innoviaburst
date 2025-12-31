import { useState, useEffect, useRef, useCallback } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import logo from "@/assets/innoviaburst-logo.png";
import logoT from "@/assets/Logo-Text.png";

// Outcome-driven navigation labels
const navLinks = [
  { label: "Automations", href: "/automations" },
  { label: "Offers", href: "/#offers" },
  { label: "Work", href: "/work" },
  { label: "Trust", href: "/trust" },
  { label: "Resources", href: "/resources" },
];

interface NavbarProps {
  onBookingClick?: () => void;
}

export function Navbar({ onBookingClick }: NavbarProps = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Focus trap and ESC key for mobile menu
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        menuButtonRef.current?.focus();
        return;
      }

      // Focus trap
      if (e.key === "Tab" && mobileMenuRef.current) {
        const focusable = mobileMenuRef.current.querySelectorAll<HTMLElement>(
          'a, button, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    // Focus first menu item when opened
    setTimeout(() => {
      const firstLink = mobileMenuRef.current?.querySelector<HTMLElement>('a, button');
      firstLink?.focus();
    }, 100);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleCTAClick = () => {
    window.dispatchEvent(new CustomEvent("analytics", { detail: { event: "cta_click", location: "navbar" } }));
    if (onBookingClick) {
      onBookingClick();
    }
  };

  const handleNavLinkClick = (href: string) => {
    setIsOpen(false);
    // Handle hash links on same page
    if (href.includes('#') && location.pathname === '/') {
      const hash = href.split('#')[1];
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const isActive = (href: string) => {
    if (href.includes('#')) return false;
    return location.pathname === href;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[90] transition-all duration-300 ${
        isScrolled ? "bg-card/95 backdrop-blur-md shadow-card border-b border-border" : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-end gap-0.5 shrink-0 focus:outline-none focus:ring-2 focus:ring-ring rounded-lg"
          >
            <img src={logo} alt="Innoviaburst - Home" className="h-10 lg:h-16 w-auto " />
            <div className="h-full flex items-end ">

            <img src={logoT} alt="Innoviaburst - Home" className="h-5 lg:h-8 w-auto" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isExternal = link.href.includes('#');
              const active = isActive(link.href);
              
              return isExternal ? (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => handleNavLinkClick(link.href)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors min-h-[40px] flex items-center focus:outline-none focus:ring-2 focus:ring-ring ${
                    active 
                      ? "text-secondary bg-secondary/10" 
                      : "text-foreground/80 hover:text-secondary hover:bg-muted"
                  }`}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors min-h-[40px] flex items-center focus:outline-none focus:ring-2 focus:ring-ring ${
                    active 
                      ? "text-secondary bg-secondary/10" 
                      : "text-foreground/80 hover:text-secondary hover:bg-muted"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitcher />
            <Button 
              variant="hero" 
              size="default" 
              onClick={handleCTAClick}
              className="min-h-[44px]"
            >
              Book a call
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            ref={menuButtonRef}
            className="lg:hidden p-2 text-foreground min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div
            ref={mobileMenuRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className="lg:hidden absolute top-full left-0 right-0 bg-card border-b border-border shadow-lg animate-fade-in"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col gap-1">
              {navLinks.map((link) => {
                const isExternal = link.href.includes('#');
                const active = isActive(link.href);
                
                return isExternal ? (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => handleNavLinkClick(link.href)}
                    className={`text-base font-medium py-3 px-4 rounded-lg min-h-[48px] flex items-center focus:outline-none focus:ring-2 focus:ring-ring ${
                      active 
                        ? "text-secondary bg-secondary/10" 
                        : "text-foreground/80 hover:text-secondary hover:bg-muted"
                    }`}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`text-base font-medium py-3 px-4 rounded-lg min-h-[48px] flex items-center focus:outline-none focus:ring-2 focus:ring-ring ${
                      active 
                        ? "text-secondary bg-secondary/10" 
                        : "text-foreground/80 hover:text-secondary hover:bg-muted"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="pt-4 border-t border-border mt-2">
                <LanguageSwitcher />
              </div>
              <Button 
                variant="hero" 
                size="lg" 
                className="mt-4 min-h-[48px]" 
                onClick={handleCTAClick}
              >
                Book a call
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}