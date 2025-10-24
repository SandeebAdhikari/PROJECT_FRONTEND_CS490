import {
  BarChart3,
  DollarSign,
  CalendarDays,
  Clock,
  Users,
  Star,
  Activity,
  UserCheck,
  UserCircle2,
  Settings,
  TrendingUp,
  TrendingDown,
  type LucideIcon,
} from "lucide-react";
import { IconName, IconNameSwitch } from "./dashboard.types";

export const icons: Record<IconName, LucideIcon> = {
  DollarSign,
  CalendarDays,
  Users,
  Star,
  Activity,
  UserCheck,
  TrendingUp,
  TrendingDown,
};

export const iconSwitch: Record<IconNameSwitch, LucideIcon> = {
  BarChart3,
  CalendarDays,
  Users,
  UserCircle2,
  Clock,
  Settings,
};
