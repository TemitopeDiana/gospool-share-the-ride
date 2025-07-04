
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { navItems } from "./nav-items";
import Index from "./pages/Index";
import Sponsorship from "./pages/Sponsorship";
import Impact from "./pages/Impact";
import NotFound from "./pages/NotFound";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { DonationsPage } from "./pages/admin/DonationsPage";
import { SponsorshipsPage } from "./pages/admin/SponsorshipsPage";
import { ImpactReportsPage } from "./pages/admin/ImpactReportsPage";
import { ApplicationsPage } from "./pages/admin/ApplicationsPage";
import { AdminUsersPage } from "./pages/admin/AdminUsersPage";
import { ProjectsPage } from "./pages/admin/ProjectsPage";
import { NewsPage } from "./pages/admin/NewsPage";
import { TeamPage } from "./pages/admin/TeamPage";
import { AdvisorsPage } from "./pages/admin/AdvisorsPage";
import { SponsorsPage } from "./pages/admin/SponsorsPage";
import { PendingChangesPage } from "./pages/admin/PendingChangesPage";
import { PaystackDiagnosticsPage } from "./pages/admin/PaystackDiagnosticsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/sponsorship" element={<Sponsorship />} />
          <Route path="/impact" element={<Impact />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/donations" element={<DonationsPage />} />
          <Route path="/admin/sponsorships" element={<SponsorshipsPage />} />
          <Route path="/admin/impact-reports" element={<ImpactReportsPage />} />
          <Route path="/admin/applications" element={<ApplicationsPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/projects" element={<ProjectsPage />} />
          <Route path="/admin/news" element={<NewsPage />} />
          <Route path="/admin/team" element={<TeamPage />} />
          <Route path="/admin/advisors" element={<AdvisorsPage />} />
          <Route path="/admin/sponsors" element={<SponsorsPage />} />
          <Route path="/admin/pending-changes" element={<PendingChangesPage />} />
          <Route path="/admin/paystack-diagnostics" element={<PaystackDiagnosticsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
