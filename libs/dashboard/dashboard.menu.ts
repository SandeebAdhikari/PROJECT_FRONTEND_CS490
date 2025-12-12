import { MenuItem } from "./dashboard.types";

export const dashboardMenu: MenuItem[] = [
  { id: 1, label: "Overview", shortLabel: "Overview", path: "overview", icon: "LayoutDashboard" },
  { id: 2, label: "Appointments", shortLabel: "Appts", path: "appointments", icon: "CalendarDays" },
  { id: 3, label: "Customers", shortLabel: "Customers", path: "customers", icon: "Users" },
  { id: 4, label: "Staff", shortLabel: "Staff", path: "staff", icon: "UserCheck" },
  { id: 5, label: "Analytics", shortLabel: "Analytics", path: "analytics", icon: "BarChart3" },
  { id: 6, label: "Payments", shortLabel: "Payments", path: "payments", icon: "CreditCard" },
  { id: 7, label: "Promotions", shortLabel: "Promo", path: "promotions", icon: "Gift" },
  { id: 8, label: "Messages", shortLabel: "Msgs", path: "messages", icon: "History" },
  { id: 9, label: "Gallery", shortLabel: "Gallery", path: "gallery", icon: "Image" },
  { id: 10, label: "Salon Settings", shortLabel: "Salon", path: "salon-settings", icon: "Settings" },
  { id: 11, label: "Account Settings", shortLabel: "Account", path: "account-settings", icon: "User" },
  { id: 12, label: "Verification", shortLabel: "Verify", path: "verification", icon: "Award" },
];
