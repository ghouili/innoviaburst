// import { Mail, Linkedin, Twitter } from "lucide-react";
// import { Link } from "react-router-dom";
// import logo from "@/assets/innoviaburst-logo.png";
// import { openCookieSettings } from "@/components/CookieConsent";

// const footerLinks = {
//   company: [
//     { label: "Offers", href: "/#offers" },
//     { label: "Solutions", href: "/#solutions" },
//     { label: "Industries", href: "/#industries" },
//     { label: "Work", href: "/#work" },
//     { label: "Automations", href: "/automations" },
//   ],
//   resources: [
//     { label: "Trust & Compliance", href: "/trust" },
//     { label: "Sub-processors", href: "/subprocessors" },
//     { label: "Resources", href: "/#resources" },
//     { label: "Contact", href: "/#contact" },
//   ],
//   legal: [
//     { label: "Privacy Policy", href: "/privacy" },
//     { label: "Cookie Policy", href: "/cookies" },
//     { label: "Terms of Service", href: "/terms" },
//   ],
// };

// export function Footer() {
//   return (
//     <footer className="py-16 pb-24 bg-foreground text-background">
//       {/* Extra bottom padding for sticky CTA bar */}
//       <div className="container mx-auto px-4 lg:px-6">
//         <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
//           {/* Logo & Info */}
//           <div className="lg:col-span-2 space-y-6">
//             <img src={logo} alt="Innoviaburst" className="h-12 w-auto brightness-0 invert" />
//             <p className="text-background/70 max-w-xs">
//               AI & Automation delivered in weeks. UK/EU focused, compliance-ready.
//             </p>
//             <div className="flex items-center gap-4">
//               <a
//                 href="mailto:hello@innoviaburst.com"
//                 className="w-12 h-12 flex justify-center items-center rounded-lg bg-background/10 hover:bg-background/20 transition-colors"
//                 aria-label="Email us"
//               >
//                 <Mail className="w-5 h-5" />
//               </a>
//               <a
//                 href="#"
//                 className="w-12 h-12 flex justify-center items-center rounded-lg bg-background/10 hover:bg-background/20 transition-colors"
//                 aria-label="LinkedIn"
//               >
//                 <Linkedin className="w-5 h-5" />
//               </a>
//               <a
//                 href="#"
//                 className="w-12 h-12 flex justify-center items-center rounded-lg bg-background/10 hover:bg-background/20 transition-colors"
//                 aria-label="Twitter"
//               >
//                 <Twitter className="w-5 h-5" />
//               </a>
//             </div>
//             <p className="text-sm text-background/50">
//               Remote-first • UK/EU clients
//             </p>
//           </div>

//           {/* Company Links */}
//           <div>
//             <h4 className="font-semibold mb-4">Company</h4>
//             <ul className="space-y-3">
//               {footerLinks.company.map((link) => (
//                 <li key={link.href}>
//                   {link.href.startsWith('/') && !link.href.includes('#') ? (
//                     <Link
//                       to={link.href}
//                       className="text-background/70 hover:text-background transition-colors"
//                     >
//                       {link.label}
//                     </Link>
//                   ) : (
//                     <a
//                       href={link.href}
//                       className="text-background/70 hover:text-background transition-colors"
//                     >
//                       {link.label}
//                     </a>
//                   )}
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Resources Links */}
//           <div>
//             <h4 className="font-semibold mb-4">Resources</h4>
//             <ul className="space-y-3">
//               {footerLinks.resources.map((link) => (
//                 <li key={link.href}>
//                   {link.href.startsWith('/') && !link.href.includes('#') ? (
//                     <Link
//                       to={link.href}
//                       className="text-background/70 hover:text-background transition-colors"
//                     >
//                       {link.label}
//                     </Link>
//                   ) : (
//                     <a
//                       href={link.href}
//                       className="text-background/70 hover:text-background transition-colors"
//                     >
//                       {link.label}
//                     </a>
//                   )}
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Legal Links */}
//           <div>
//             <h4 className="font-semibold mb-4">Legal</h4>
//             <ul className="space-y-3">
//               {footerLinks.legal.map((link) => (
//                 <li key={link.href}>
//                   <Link
//                     to={link.href}
//                     className="text-background/70 hover:text-background transition-colors"
//                   >
//                     {link.label}
//                   </Link>
//                 </li>
//               ))}
//               <li>
//                 <button
//                   onClick={openCookieSettings}
//                   className="text-background/70 hover:text-background transition-colors"
//                 >
//                   Cookie Settings
//                 </button>
//               </li>
//             </ul>
//           </div>
//         </div>

//         {/* Company Disclosure */}
//         {/* <div className="py-4 border-t border-background/10 mb-4">
//           <p className="text-xs text-background/50 text-center">
//             Innoviaburst Ltd (Company No. XXXXXXXX) — Registered in England and Wales — Registered office: [ADDRESS]
//           </p>
//         </div> */}

//         {/* Bottom Bar */}
//         <div className="pt-4 border-t border-background/10 flex flex-col sm:flex-row justify-between items-center gap-4">
//           <p className="text-sm text-background/50">
//             © {new Date().getFullYear()} Innoviaburst. All rights reserved.
//           </p>
//           <p className="text-sm text-background/50">
//             Built with focus on UK GDPR & EU compliance readiness.
//           </p>
//         </div>
//       </div>
//     </footer>
//   );
// }
import { Mail, Linkedin, Twitter, Instagram } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "@/assets/innoviaburst-logo.png";
import { openCookieSettings } from "@/components/CookieConsent";
import { NewsletterForm } from "@/components/NewsletterForm";

const footerLinks = {
  company: [
    { label: "Offers", href: "/#offers" },
    { label: "Solutions", href: "/#solutions" },
    { label: "Industries", href: "/#industries" },
    { label: "Work", href: "/#work" },
    { label: "Automations", href: "/automations" },
  ],
  resources: [
    { label: "Trust & Compliance", href: "/trust" },
    { label: "Sub-processors", href: "/subprocessors" },
    { label: "Resources", href: "/#resources" },
    { label: "Contact", href: "/#contact" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Terms of Service", href: "/terms" },
    // Optional “Accessibility” page if/when you add it:
    // { label: "Accessibility", href: "/accessibility" },
  ],
};

const socialLinks = [
  { label: "Email us", href: "mailto:hello@innoviaburst.com", Icon: Mail, external: false },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/innoviaburst/?viewAsMember=true", Icon: Linkedin, external: true },
  { label: "Instagram", href: "https://www.instagram.com/innoviaburst/", Icon: Instagram, external: true },
  { label: "Twitter / X", href: "https://www.instagram.com/innoviaburst/", Icon: Twitter, external: true },
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

export function Footer() {
  return (
    <footer className="py-16 pb-24 bg-foreground text-background">
      {/* Extra bottom padding for sticky CTA bar */}
      <div className="container mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 lg:gap-12 mb-12">
          {/* Logo & Info */}
          <div className="sm:col-span-2 lg:col-span-2 space-y-6">
            <img
              src={logo}
              alt="InnoviaBurst"
              className="h-12 w-auto brightness-0 invert"
              loading="lazy"
            />

            <p className="text-background/75 max-w-sm leading-relaxed">
              AI & Automation delivered in weeks. UK/EU-focused, designed with UK GDPR & EU GDPR considerations in mind.
            </p>

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
              Remote-first • UK/EU clients
            </p>
          </div>

          {/* Company Links */}
          <nav aria-label="Company" className="space-y-4">
            <h4 className="font-semibold">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <FooterNavLink href={link.href}>{link.label}</FooterNavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Resources Links */}
          <nav aria-label="Resources" className="space-y-4">
            <h4 className="font-semibold">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <FooterNavLink href={link.href}>{link.label}</FooterNavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal Links */}
          <nav aria-label="Legal" className="space-y-4">
            <h4 className="font-semibold">Legal</h4>
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
                  Cookie Settings
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Newsletter Signup Section */}
        <div className="py-8 border-t border-background/10 mb-8">
          <div className="max-w-md">
            <NewsletterForm
              placement="footer"
              shortConsent
              headline="Stay updated"
              description="Get automation insights and new templates. No spam."
              buttonText="Subscribe"
            />
          </div>
        </div>

        {/* Optional: Company disclosure (enable when you have real data) */}
        {/*
        <div className="py-4 border-t border-background/10 mb-4">
          <p className="text-xs text-background/55 text-center">
            InnoviaBurst Ltd (Company No. XXXXXXXX) — Registered in England and Wales — Registered office: [ADDRESS]
          </p>
        </div>
        */}

        {/* Bottom Bar */}
        <div className="pt-4 border-t border-background/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-background/55">
            © {new Date().getFullYear()} InnoviaBurst. All rights reserved.
          </p>
          <p className="text-sm text-background/55">
            UK/EU-focused — privacy & security information available in Trust & Compliance.
          </p>
        </div>
      </div>
    </footer>
  );
}
