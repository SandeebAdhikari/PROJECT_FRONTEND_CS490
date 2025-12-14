import { MenuItem } from "./dashboard.types";

export const dashboardMenu: MenuItem[] = [
  { id: 1, label: "Overview", shortLabel: "Overview", path: "overview", icon: "LayoutDashboard" },
  { id: 2, label: "Appointments", shortLabel: "Appts", path: "appointments", icon: "CalendarDays" },
  { id: 3, label: "Customers", shortLabel: "Customers", path: "customers", icon: "Users" },
  { id: 4, label: "Reviews", shortLabel: "Reviews", path: "reviews", icon: "Star" },
  { id: 5, label: "Staff", shortLabel: "Staff", path: "staff", icon: "UserCheck" },
  { id: 6, label: "Analytics", shortLabel: "Analytics", path: "analytics", icon: "BarChart3" },
  { id: 7, label: "Payments", shortLabel: "Payments", path: "payments", icon: "CreditCard" },
  { id: 8, label: "Promotions", shortLabel: "Promo", path: "promotions", icon: "Gift" },
  { id: 9, label: "Messages", shortLabel: "Msgs", path: "messages", icon: "History" },
  { id: 10, label: "Gallery", shortLabel: "Gallery", path: "gallery", icon: "Image" },
  { id: 11, label: "Salon Settings", shortLabel: "Salon", path: "salon-settings", icon: "Settings" },
  { id: 12, label: "Account Settings", shortLabel: "Account", path: "account-settings", icon: "User" },
];
