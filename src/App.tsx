import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ScrollToTop } from "@/components/ScrollToTop";
import "@/i18n";

// Eager load: critical path (homepage + 404)
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy load: secondary pages (code-split into separate chunks)
const AutomationsPage = lazy(() => import("./pages/AutomationsPage"));
const CaseStudyPage = lazy(() => import("./pages/CaseStudyPage"));
const OfferPage = lazy(() => import("./pages/OfferPage"));
const TrustPage = lazy(() => import("./pages/TrustPage"));
const SubprocessorsPage = lazy(() => import("./pages/SubprocessorsPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const CookiesPage = lazy(() => import("./pages/CookiesPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const WorkPage = lazy(() => import("./pages/WorkPage"));
const ResourcesPage = lazy(() => import("./pages/ResourcesPage"));
const IndustriesPage = lazy(() => import("./pages/IndustriesPage"));
const ComingSoonPage = lazy(() => import("./pages/ComingSoonPage"));

const queryClient = new QueryClient();

// Minimal loading fallback (prevents layout shift)
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-pulse text-muted-foreground">Loading...</div>
  </div>
);

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <ScrollToTop />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/automations" element={<AutomationsPage />} />
              <Route path="/work" element={<ComingSoonPage />} />
              <Route path="/works" element={<WorkPage />} />
              <Route path="/work/:slug" element={<CaseStudyPage />} />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/industries" element={<IndustriesPage />} />
              <Route path="/coming-soon" element={<ComingSoonPage />} />
              <Route path="/trust" element={<TrustPage />} />
              <Route path="/subprocessors" element={<SubprocessorsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/cookies" element={<CookiesPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/:slug" element={<OfferPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
