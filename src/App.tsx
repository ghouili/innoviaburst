import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import "@/i18n";
import "./index.css";

// Eager imports (no React.lazy): renderToString does not await Suspense for
// lazily-loaded chunks, so SSR would emit the loading fallback instead of the
// page. Route-level code-splitting is revisited in Phase 10 (performance).
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AutomationsPage from "./pages/AutomationsPage";
import CaseStudyPage from "./pages/CaseStudyPage";
import OfferPage from "./pages/OfferPage";
import TrustPage from "./pages/TrustPage";
import SubprocessorsPage from "./pages/SubprocessorsPage";
import PrivacyPage from "./pages/PrivacyPage";
import CookiesPage from "./pages/CookiesPage";
import TermsPage from "./pages/TermsPage";
import WorkPage from "./pages/WorkPage";
import ResourcesPage from "./pages/ResourcesPage";
import IndustriesPage from "./pages/IndustriesPage";
import ComingSoonPage from "./pages/ComingSoonPage";
import LandingPage from "./pages/LandingPage";

const queryClient = new QueryClient();

// Minimal loading fallback (prevents layout shift)
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-pulse text-muted-foreground">Loading...</div>
  </div>
);

/**
 * AppShell — everything that lives *inside* the router and head provider.
 * The router (StaticRouter on the server, BrowserRouter on the client) and
 * HelmetProvider are supplied by the Vike render hooks so the same tree can be
 * server-rendered and hydrated. Paths here are flat ("/automations"); the
 * locale prefix ("/en") is applied via the router `basename`.
 */
export function AppShell() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/automations" element={<AutomationsPage />} />
            <Route path="/works" element={<WorkPage />} />
            <Route path="/work/:slug" element={<CaseStudyPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/industries" element={<IndustriesPage />} />
            <Route path="/coming-soon" element={<ComingSoonPage />} />
            <Route path="/lp/ai-automation" element={<LandingPage />} />
            <Route path="/trust" element={<TrustPage />} />
            <Route path="/subprocessors" element={<SubprocessorsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/cookies" element={<CookiesPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="/:slug" element={<OfferPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default AppShell;
