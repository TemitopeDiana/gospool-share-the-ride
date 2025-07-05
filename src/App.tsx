
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import Index from "./pages/Index";
import Impact from "./pages/Impact";
import Sponsorship from "./pages/Sponsorship";
import NotFound from "./pages/NotFound";

// Admin pages
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminLogin } from "./components/admin/AdminLogin";
import { DonationsPage } from "./pages/admin/DonationsPage";
import { SponsorshipsPage } from "./pages/admin/SponsorshipsPage";
import { ImpactReportsPage } from "./pages/admin/ImpactReportsPage";
import { ApplicationsPage } from "./pages/admin/ApplicationsPage";
import { ProjectsPage } from "./pages/admin/ProjectsPage";
import { NewsPage } from "./pages/admin/NewsPage";
import { TeamPage } from "./pages/admin/TeamPage";
import { AdvisorsPage } from "./pages/admin/AdvisorsPage";
import { SponsorsPage } from "./pages/admin/SponsorsPage";
import { AdminUsersPage } from "./pages/admin/AdminUsersPage";
import { PendingChangesPage } from "./pages/admin/PendingChangesPage";
import { PaystackDiagnosticsPage } from "./pages/admin/PaystackDiagnosticsPage";
import { SponsorRequestsPage } from "./pages/admin/SponsorRequestsPage";
import { VolunteerApplicationsPage } from "./pages/admin/VolunteerApplicationsPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/impact" element={<Impact />} />
            <Route path="/sponsorship" element={<Sponsorship />} />
            
            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/donations" element={<DonationsPage />} />
            <Route path="/admin/sponsorships" element={<SponsorshipsPage />} />
            <Route path="/admin/sponsor-requests" element={<SponsorRequestsPage />} />
            <Route path="/admin/impact-reports" element={<ImpactReportsPage />} />
            <Route path="/admin/applications" element={<ApplicationsPage />} />
            <Route path="/admin/volunteer-applications" element={<VolunteerApplicationsPage />} />
            <Route path="/admin/projects" element={<ProjectsPage />} />
            <Route path="/admin/news" element={<NewsPage />} />
            <Route path="/admin/team" element={<TeamPage />} />
            <Route path="/admin/advisors" element={<AdvisorsPage />} />
            <Route path="/admin/sponsors" element={<SponsorsPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/pending-changes" element={<PendingChangesPage />} />
            <Route path="/admin/paystack-diagnostics" element={<PaystackDiagnosticsPage />} />
            
            {/* Catch all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
