import { LucideIcon } from "lucide-react";
import type { icons } from "./dashboard.icons";

export type IconName = keyof typeof icons;
export type IconNameSwitch = IconName;

export type DashboardItem = {
  id: number;
  title: string;
  value: string;
  subtext: string;
  change: string;
  icon: IconName;
  trendIcon: IconName;
};

export type MenuItem = {
  id: number;
  label: string;
  shortLabel: string;
  path: string;
  icon: IconName;
};

export type DashboardData = {
  cards: DashboardItem[];
  menu: MenuItem[];
};

export type DashboardCardProps = {
  title: string;
  value: string | number;
  subtext?: string;
  change: string;
  icon: LucideIcon;
  trendIcon: LucideIcon;
};
