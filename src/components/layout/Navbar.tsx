import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { hashLinkProps, isHashLink } from "@/lib/hash-nav";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logo from "@/assets/innoviaburst-logo.webp";
import logoT from "@/assets/Logo-Text.webp";

interface NavChild {
  labelKey: string;
  href: string;
}

interface NavItem {
  labelKey: string;
  /** Leaf link. Mutually exclusive with `children`. */
  href?: string;
  /** Renders a dropdown instead of a leaf link. */
  children?: NavChild[];
}

/**
 * Top-level navigation. The four service destinations live under a single
 * "Services" dropdown: six flat links overflowed the bar at the `lg` breakpoint
 * (1024px), where the desktop nav first appears, by ~72px.
 */
const navItems: NavItem[] = [
  {
    labelKey: "nav.services",
    children: [
      { labelKey: "nav.automations", href: "/automations" },
      { labelKey: "nav.mvp", href: "/mvp-launch" },
      { labelKey: "nav.offers", href: "/#offers" },
      { labelKey: "nav.training", href: "/training" },
    ],
  },
  { labelKey: "nav.work", href: "/works" },
  { labelKey: "nav.trust", href: "/trust" },
  { labelKey: "nav.resources", href: "/resources" },
];

/** Flat list of every destination — used by the mobile menu and active checks. */
const allLinks: NavChild[] = navItems.flatMap((item) =>
  item.children ? item.children : [{ labelKey: item.labelKey, href: item.href! }],
);

interface NavbarProps {
  onBookingClick?: () => void;
}

export function Navbar({ onBookingClick }: NavbarProps = {}) {
  const { t } = useTranslation();
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

  // Close mobile menu on outside click/touch
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      // Check if click is outside menu and menu button
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    // Use both mousedown and touchstart for iOS + desktop compatibility
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [isOpen]);

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

  // A dropdown reads as active when the current route is one of its children.
  const isGroupActive = (item: NavItem) =>
    !!item.children?.some((child) => isActive(child.href));

  // Active state uses --deep-blue-dark, not --secondary: secondary on
  // secondary/10 measures 4.11:1, under the 4.5 AA floor. It only showed up on
  // pages that are nav children (e.g. /mvp-launch under Services), so it sat
  // unnoticed. deep-blue-dark on the same tint is 8.1:1.
  const desktopItemClasses = (active: boolean) =>
    `px-3 xl:px-4 py-2 text-sm font-medium rounded-lg transition-colors min-h-[40px] flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-ring ${
      active ? "text-deep-blue-dark bg-secondary/10" : "text-foreground/80 hover:text-secondary hover:bg-muted"
    }`;

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
            className="flex items-end gap-0.5 shrink-0 focus:outline-none focus:ring-0 focus:ring-ring rounded-lg"
          >
            {/* Slightly smaller at lg: at 1024px the full-size lockup costs
                224px of bar, which pushes the longer FR labels into overflow. */}
            <img src={logo} alt="InnoviaBurst - Home" width={256} height={256} className="h-10 lg:h-12 xl:h-16 w-auto " />
            <div className="h-full flex items-end ">

            <img src={logoT} alt="InnoviaBurst - Home" width={480} height={96} className="h-5 lg:h-6 xl:h-8 w-auto" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              // Grouped item -> dropdown. Radix DropdownMenu gives us the full
              // keyboard contract for free: Enter/Space/ArrowDown to open,
              // arrows to move, Escape to close, focus returned to the trigger.
              if (item.children) {
                const active = isGroupActive(item);
                return (
                  // modal={false}: this is navigation, not a dialog. The default
                  // (modal) locks body scroll and marks the rest of the page
                  // aria-hidden while open, which hides the nav from AT users.
                  <DropdownMenu key={item.labelKey} modal={false}>
                    <DropdownMenuTrigger className={`${desktopItemClasses(active)} group`}>
                      {t(item.labelKey)}
                      <ChevronDown
                        className="w-4 h-4 transition-transform duration-200 group-data-[state=open]:rotate-180"
                        aria-hidden="true"
                      />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="min-w-[13rem]">
                      {item.children.map((child) => {
                        const childActive = isActive(child.href);
                        const childClasses = `w-full cursor-pointer text-sm font-medium ${
                          childActive ? "text-secondary" : ""
                        }`;
                        return (
                          <DropdownMenuItem key={child.href} asChild>
                            {isHashLink(child.href) ? (
                              <Link {...hashLinkProps(child.href)} className={childClasses}>
                                {t(child.labelKey)}
                              </Link>
                            ) : (
                              <Link
                                to={child.href}
                                aria-current={childActive ? "page" : undefined}
                                className={childClasses}
                              >
                                {t(child.labelKey)}
                              </Link>
                            )}
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }

              const href = item.href!;
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  to={href}
                  aria-current={active ? "page" : undefined}
                  className={desktopItemClasses(active)}
                >
                  {t(item.labelKey)}
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
              className="min-h-[44px] px-4 xl:px-5"
            >
              {t("nav.bookCall")}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            ref={menuButtonRef}
            className="lg:hidden p-2 text-foreground min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? t("nav.closeMenu", "Close menu") : t("nav.openMenu", "Open menu")}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Overlay */}
        {isOpen && (
          <div
            className="lg:hidden fixed inset-0 top-16 bg-black/40 z-40 animate-fade-in"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Mobile Navigation */}
        {isOpen && (
          <div
            ref={mobileMenuRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label={t("nav.menuLabel", "Navigation menu")}
            className="lg:hidden absolute top-full left-0 right-0 bg-card border-b border-border shadow-lg animate-fade-in z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="container mx-auto px-4 py-6 flex flex-col gap-1">
              {/* Flat list on mobile — a vertical sheet has the room, so the
                  "Services" grouping would only add a tap to reach each item. */}
              {allLinks.map((link) => {
                const label = t(link.labelKey);
                const isExternal = link.href.includes('#');
                const active = isActive(link.href);
                
                return isExternal ? (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => handleNavLinkClick(link.href)}
                    className={`text-base font-medium py-3 px-4 rounded-lg min-h-[48px] flex items-center focus:outline-none focus:ring-2 focus:ring-ring ${
                      active 
                        ? "text-deep-blue-dark bg-secondary/10" 
                        : "text-foreground/80 hover:text-secondary hover:bg-muted"
                    }`}
                  >
                    {label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`text-base font-medium py-3 px-4 rounded-lg min-h-[48px] flex items-center focus:outline-none focus:ring-2 focus:ring-ring ${
                      active 
                        ? "text-deep-blue-dark bg-secondary/10" 
                        : "text-foreground/80 hover:text-secondary hover:bg-muted"
                    }`}
                  >
                    {label}
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
                onClick={() => {
                  setIsOpen(false);
                  handleCTAClick();
                }}
              >
                {t("nav.bookCall")}
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}