
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { navItems } from "./nav-items";
import Index from "./pages/Index";
import Impact from "./pages/Impact";
import Sponsorship from "./pages/Sponsorship";
import NotFound from "./pages/NotFound";
import { AdminLoginPage } from "./pages/admin/AdminLoginPage";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminUsersPage } from "./pages/admin/AdminUsersPage";
import { AdvisorsPage } from "./pages/admin/AdvisorsPage";
import { VolunteerApplicationsPage } from "./pages/admin/VolunteerApplicationsPage";
import { DonationsPage } from "./pages/admin/DonationsPage";
import { RecentDonorsPage } from "./pages/admin/RecentDonorsPage";
import { ImpactReportsPage } from "./pages/admin/ImpactReportsPage";
import { NewsPage } from "./pages/admin/NewsPage";
import { PaystackDiagnosticsPage } from "./pages/admin/PaystackDiagnosticsPage";
import { PendingChangesPage } from "./pages/admin/PendingChangesPage";
import { ProjectsPage } from "./pages/admin/ProjectsPage";
import { SponsorRequestsPage } from "./pages/admin/SponsorRequestsPage";
import { SponsorsPage } from "./pages/admin/SponsorsPage";
import { TeamPage } from "./pages/admin/TeamPage";
import { PitchDeckRequestsPage } from "./pages/admin/PitchDeckRequestsPage";
import AnalyticsDashboard from "./pages/admin/AnalyticsDashboard";
import { DebugForm } from "./pages/admin/DebugForm";
import { AdminThemeProvider } from "./contexts/AdminThemeContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AdminThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/impact" element={<Impact />} />
            <Route path="/sponsorship" element={<Sponsorship />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/analytics" element={<AnalyticsDashboard />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/advisors" element={<AdvisorsPage />} />
            <Route path="/admin/volunteer-applications" element={<VolunteerApplicationsPage />} />
            <Route path="/admin/donations" element={<DonationsPage />} />
            <Route path="/admin/recent-donors" element={<RecentDonorsPage />} />
            <Route path="/admin/impact-reports" element={<ImpactReportsPage />} />
            <Route path="/admin/pitch-deck-requests" element={<PitchDeckRequestsPage />} />
            <Route path="/admin/news" element={<NewsPage />} />
            <Route path="/admin/paystack-diagnostics" element={<PaystackDiagnosticsPage />} />
            <Route path="/admin/pending-changes" element={<PendingChangesPage />} />
            <Route path="/admin/projects" element={<ProjectsPage />} />
            <Route path="/admin/sponsor-requests" element={<SponsorRequestsPage />} />
            <Route path="/admin/sponsors" element={<SponsorsPage />} />
            <Route path="/admin/team" element={<TeamPage />} />
            <Route path="/admin/debug" element={<DebugForm />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AdminThemeProvider>
  </QueryClientProvider>
);

export default App;
