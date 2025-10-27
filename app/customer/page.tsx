import React from "react";
import { Calendar, Clock, MapPin } from "lucide-react";

const CustomerPage = () => {
  return (
    <div className="p-4 sm:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Upcoming Appointments</h2>
          <div className="space-y-4">
            <div className="border border-border bg-secondary rounded-lg p-6 hover:shadow-soft-br transition-smooth">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">Haircut & Styling</h3>
                  <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">October 29, 2025</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">2:30 PM - 3:30 PM</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">Lux Hair Salon - Downtown</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Stylist: Sarah Johnson
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <button className="px-4 py-2 text-sm bg-primary-light text-white rounded-lg hover:bg-primary transition-smooth">
                    Reschedule
                  </button>
                  <button className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-accent transition-smooth">
                    Cancel
                  </button>
                </div>
              </div>
            </div>

            <div className="border border-border bg-secondary rounded-lg p-6 hover:shadow-soft-br transition-smooth">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">Hair Coloring</h3>
                  <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">November 5, 2025</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">10:00 AM - 12:00 PM</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">Lux Hair Salon - Downtown</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Stylist: Michael Chen
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <button className="px-4 py-2 text-sm bg-primary-light text-white rounded-lg hover:bg-primary transition-smooth">
                    Reschedule
                  </button>
                  <button className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-accent transition-smooth">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full p-4 border border-border bg-secondary rounded-lg hover:shadow-soft-br transition-smooth text-left">
              <h3 className="font-semibold">Book New Appointment</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Schedule your next visit
              </p>
            </button>
            <button className="w-full p-4 border border-border bg-secondary rounded-lg hover:shadow-soft-br transition-smooth text-left">
              <h3 className="font-semibold">View Services</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Browse all available services
              </p>
            </button>
            <button className="w-full p-4 border border-border bg-secondary rounded-lg hover:shadow-soft-br transition-smooth text-left">
              <h3 className="font-semibold">Redeem Rewards</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Use your 850 loyalty points
              </p>
            </button>
            <button className="w-full p-4 border border-border bg-secondary rounded-lg hover:shadow-soft-br transition-smooth text-left">
              <h3 className="font-semibold">Update Profile</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your account settings
              </p>
            </button>
          </div>

          {/* Recent Activity */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Recent Activity</h3>
            <div className="space-y-2">
              <div className="p-3 border border-border bg-secondary rounded-lg text-sm">
                <p className="font-medium">Appointment Completed</p>
                <p className="text-muted-foreground">Haircut - Oct 12, 2025</p>
              </div>
              <div className="p-3 border border-border bg-secondary rounded-lg text-sm">
                <p className="font-medium">Reward Earned</p>
                <p className="text-muted-foreground">+50 loyalty points</p>
              </div>
              <div className="p-3 border border-border bg-secondary rounded-lg text-sm">
                <p className="font-medium">Review Submitted</p>
                <p className="text-muted-foreground">5-star rating</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerPage;
