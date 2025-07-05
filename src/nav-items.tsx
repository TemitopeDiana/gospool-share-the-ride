
import { HomeIcon, Users, Heart, FileText } from "lucide-react";

export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
  },
  {
    title: "Impact",
    to: "/impact",
    icon: <Users className="h-4 w-4" />,
  },
  {
    title: "Support Us",
    to: "/sponsorship",
    icon: <Heart className="h-4 w-4" />,
  },
  {
    title: "Admin",
    to: "/admin",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    title: "Sponsor Requests",
    to: "/admin/sponsor-requests",
    icon: <Heart className="h-4 w-4" />,
  },
  {
    title: "Volunteer Applications",
    to: "/admin/volunteer-applications",
    icon: <Users className="h-4 w-4" />,
  },
];
