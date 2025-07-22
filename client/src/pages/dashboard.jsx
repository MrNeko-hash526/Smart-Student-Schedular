import QuickStats from "@/components/dashboard/quick-stats";
import TodaySchedule from "@/components/dashboard/today-schedule";
import QuickAddTask from "@/components/dashboard/quick-add-task";
import UpcomingDeadlines from "@/components/dashboard/upcoming-deadlines";
import ProgressOverview from "@/components/dashboard/progress-overview";
import RecentActivity from "@/components/dashboard/recent-activity";
import { Clock, Calendar, Target, TrendingUp } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Welcome Section */}
      <div className="card-modern p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-3">
              Welcome back, Alex! 👋
            </h1>
            <p className="text-gray-600 text-lg">
              Ready to make today productive? You have 3 tasks due this week.
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <div className="text-center">
              <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mb-2 shadow-lg">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <p className="text-sm font-medium text-gray-600">Focus Time</p>
              <p className="text-lg font-bold text-gray-900">2.5h</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mb-2 shadow-lg">
                <Target className="w-8 h-8 text-white" />
              </div>
              <p className="text-sm font-medium text-gray-600">Tasks Done</p>
              <p className="text-lg font-bold text-gray-900">8/12</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <QuickStats />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          <TodaySchedule />
          <QuickAddTask />
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <UpcomingDeadlines />
          <ProgressOverview />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
