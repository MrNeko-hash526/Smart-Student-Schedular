import QuickStats from "@/components/dashboard/quick-stats";
import TodaySchedule from "@/components/dashboard/today-schedule";
import AIStudyPlanner from "@/components/dashboard/ai-study-planner";
import QuickAddTask from "@/components/dashboard/quick-add-task";
import UpcomingDeadlines from "@/components/dashboard/upcoming-deadlines";
import ProgressOverview from "@/components/dashboard/progress-overview";
import RecentActivity from "@/components/dashboard/recent-activity";

export default function Dashboard() {
  return (
    <div className="p-4 md:p-8">
      {/* Welcome Section */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Welcome back, Alex!</h1>
        <p className="text-gray-600">You have upcoming deadlines this week. Let's plan your study sessions.</p>
      </div>

      {/* Quick Stats */}
      <QuickStats />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <TodaySchedule />
          <AIStudyPlanner />
          <QuickAddTask />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <UpcomingDeadlines />
          <ProgressOverview />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
