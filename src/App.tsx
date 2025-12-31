import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import "@/i18n";
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

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
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
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
