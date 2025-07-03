
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { navItems } from "./nav-items";
import Index from "./pages/Index";
import { AdminLogin } from "./components/admin/AdminLogin";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { DonationsPage } from "./pages/admin/DonationsPage";
import { SponsorshipsPage } from "./pages/admin/SponsorshipsPage";
import { ImpactReportsPage } from "./pages/admin/ImpactReportsPage";
import { ProjectsPage } from "./pages/admin/ProjectsPage";
import { NewsPage } from "./pages/admin/NewsPage";
import { TeamPage } from "./pages/admin/TeamPage";
import { AdvisorsPage } from "./pages/admin/AdvisorsPage";
import { SponsorsPage } from "./pages/admin/SponsorsPage";
import { ApplicationsPage } from "./pages/admin/ApplicationsPage";
import { AdminUsersPage } from "./pages/admin/AdminUsersPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {navItems.map(({ to, page }) => (
            <Route key={to} path={to} element={page} />
          ))}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/donations" element={<DonationsPage />} />
          <Route path="/admin/sponsorships" element={<SponsorshipsPage />} />
          <Route path="/admin/reports" element={<ImpactReportsPage />} />
          <Route path="/admin/projects" element={<ProjectsPage />} />
          <Route path="/admin/news" element={<NewsPage />} />
          <Route path="/admin/team" element={<TeamPage />} />
          <Route path="/admin/advisors" element={<AdvisorsPage />} />
          <Route path="/admin/sponsors" element={<SponsorsPage />} />
          <Route path="/admin/applications" element={<ApplicationsPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
