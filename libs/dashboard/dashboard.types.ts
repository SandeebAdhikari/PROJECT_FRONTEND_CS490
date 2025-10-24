import { LucideIcon } from "lucide-react";

export type IconName =
  | "DollarSign"
  | "CalendarDays"
  | "Users"
  | "Star"
  | "Activity"
  | "UserCheck"
  | "TrendingUp"
  | "TrendingDown";

export type IconNameSwitch =
  | "BarChart3"
  | "CalendarDays"
  | "Users"
  | "UserCircle2"
  | "Clock"
  | "Settings";

export type DashboardItem = {
  id: number;
  title: string;
  value: string;
  subtext: string;
  change: string;
  icon: IconName;
  trendIcon: IconName;
};

export type DashboardCardProps = {
  title: string;
  value: string | number;
  subtext?: string;
  change: string;
  icon: LucideIcon;
  trendIcon: LucideIcon;
};
