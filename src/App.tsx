import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import MandatesDashboard from "./pages/MandatesDashboard";
import CreateMandate from "./pages/CreateMandate";
import MandateDetail from "./pages/MandateDetail";
import CompanyProfile from "./pages/CompanyProfile";
import CompareCompanies from "./pages/CompareCompanies";
import PipelineCRM from "./pages/PipelineCRM";
import Analytics from "./pages/Analytics";
import ActivityTimeline from "./pages/ActivityTimeline";
import Watchlist from "./pages/Watchlist";
import Projects from "./pages/Projects";
import Deliverables from "./pages/Deliverables";
import Support from "./pages/Support";
import ApiIntegrations from "./pages/ApiIntegrations";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const protectedLayout = (node: JSX.Element) => (
  <ProtectedRoute>
    <AppLayout>{node}</AppLayout>
  </ProtectedRoute>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
            <Route path="/mandates" element={protectedLayout(<MandatesDashboard />)} />
            <Route path="/mandates/create" element={protectedLayout(<CreateMandate />)} />
            <Route path="/mandates/:id" element={protectedLayout(<MandateDetail />)} />
            <Route path="/companies/:id" element={<AppLayout><CompanyProfile /></AppLayout>} />
            <Route path="/compare" element={<AppLayout><CompareCompanies /></AppLayout>} />
            <Route path="/pipeline" element={<AppLayout><PipelineCRM /></AppLayout>} />
            <Route path="/analytics" element={<AppLayout><Analytics /></AppLayout>} />
            <Route path="/activity" element={<AppLayout><ActivityTimeline /></AppLayout>} />
            <Route path="/watchlist" element={<AppLayout><Watchlist /></AppLayout>} />
            <Route path="/projects" element={<AppLayout><Projects /></AppLayout>} />
            <Route path="/deliverables" element={<AppLayout><Deliverables /></AppLayout>} />
            <Route path="/support" element={<AppLayout><Support /></AppLayout>} />
            <Route path="/api-integrations" element={<AppLayout><ApiIntegrations /></AppLayout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
