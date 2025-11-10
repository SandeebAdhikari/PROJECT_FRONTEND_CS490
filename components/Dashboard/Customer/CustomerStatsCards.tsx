import React from "react";
import { Users, DollarSign, Star, Activity } from "lucide-react";

interface CustomerStats {
  totalCustomers: number;
  activeCustomers: number;
  newThisMonth: number;
  averageLifetimeValue: number;
  averageSatisfaction: number;
  retentionRate: number;
}

interface CustomerStatsCardsProps {
  stats: CustomerStats;
}

const CustomerStatsCards: React.FC<CustomerStatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-primary-foreground border border-gray-200 rounded-xl p-4 sm:p-6 flex justify-between items-center">
        <div>
          <p className="text-xs sm:text-sm text-gray-500 mb-1">
            Total Customers
          </p>
          <p className="text-2xl sm:text-3xl font-bold">
            {stats.totalCustomers}
          </p>
        </div>
        <div className="flex items-center justify-between mb-2">
          <div className="p-2 bg-blue-100 rounded-lg ">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 flex justify-between items-center">
        <div>
          <p className="text-xs sm:text-sm text-gray-500 mb-1">VIP Customers</p>
          <p className="text-2xl sm:text-3xl font-bold">
            {Math.floor(stats.totalCustomers * 0.15)}
          </p>
        </div>
        <div className="flex items-center justify-between mb-2">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <Star className="w-5 h-5 text-yellow-600" />
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 flex justify-between items-center">
        <div>
          <p className="text-xs sm:text-sm text-gray-500 mb-1">Total Revenue</p>
          <p className="text-2xl sm:text-3xl font-bold">
            $
            {(
              stats.totalCustomers * stats.averageLifetimeValue
            ).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center justify-between mb-2">
          <div className="p-2 bg-green-100 rounded-lg">
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 flex justify-between items-center">
        <div>
          <p className="text-xs sm:text-sm text-gray-500 mb-1">Avg Spend</p>
          <p className="text-2xl sm:text-3xl font-bold">
            ${stats.averageLifetimeValue}
          </p>
        </div>
        <div className="flex items-center justify-between mb-2">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Activity className="w-5 h-5 text-purple-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerStatsCards;
