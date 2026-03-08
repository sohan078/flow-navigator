import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import Dashboard from "./pages/Dashboard";
import MandatesDashboard from "./pages/MandatesDashboard";
import CreateMandate from "./pages/CreateMandate";
import MandateDetail from "./pages/MandateDetail";
import CompanyProfile from "./pages/CompanyProfile";
import PipelineCRM from "./pages/PipelineCRM";
import Watchlist from "./pages/Watchlist";
import Projects from "./pages/Projects";
import Deliverables from "./pages/Deliverables";
import Support from "./pages/Support";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/mandates" element={<MandatesDashboard />} />
            <Route path="/mandates/create" element={<CreateMandate />} />
            <Route path="/mandates/:id" element={<MandateDetail />} />
            <Route path="/companies/:id" element={<CompanyProfile />} />
            <Route path="/pipeline" element={<PipelineCRM />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/deliverables" element={<Deliverables />} />
            <Route path="/support" element={<Support />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
