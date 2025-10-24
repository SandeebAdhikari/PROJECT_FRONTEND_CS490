export type IconName =
  | "DollarSign"
  | "CalendarDays"
  | "Users"
  | "Star"
  | "Activity"
  | "UserCheck"
  | "TrendingUp"
  | "TrendingDown";

export type DashboardItem = {
  id: number;
  title: string;
  value: string;
  subtext: string;
  change: string;
  icon: IconName;
  trendIcon: IconName;
};
