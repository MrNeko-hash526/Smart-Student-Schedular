import { useTasks } from "@/hooks/use-tasks";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Target, Clock, BookOpen } from "lucide-react";

export default function Analytics() {
  const { data: tasks, isLoading } = useTasks();

  if (isLoading) {
    return (
      <div className="p-4 md:p-8">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
          <p className="text-gray-600">Track your study progress and productivity.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter(task => task.status === "completed").length || 0;
  const inProgressTasks = tasks?.filter(task => task.status === "in-progress").length || 0;
  const pendingTasks = tasks?.filter(task => task.status === "pending").length || 0;

  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const totalEstimatedHours = tasks?.reduce((sum, task) => sum + (task.estimatedHours || 0), 0) || 0;
  const totalActualHours = tasks?.reduce((sum, task) => sum + (task.actualHours || 0), 0) || 0;

  // Subject breakdown
  const subjectStats = tasks?.reduce((acc: any, task) => {
    const subjectName = task.subject?.name || "Other";
    if (!acc[subjectName]) {
      acc[subjectName] = { total: 0, completed: 0 };
    }
    acc[subjectName].total++;
    if (task.status === "completed") {
      acc[subjectName].completed++;
    }
    return acc;
  }, {}) || {};

  const analyticsCards = [
    {
      title: "Completion Rate",
      value: `${completionRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Total Tasks",
      value: totalTasks,
      icon: Target,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Study Hours",
      value: `${totalActualHours}h`,
      icon: Clock,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      title: "Active Subjects",
      value: Object.keys(subjectStats).length,
      icon: BookOpen,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
  ];

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
        <p className="text-gray-600">Track your study progress and productivity.</p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {analyticsCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                </div>
                <div className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${card.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Status Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Status Breakdown</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">Completed</span>
                <span className="font-medium text-accent">{completedTasks}</span>
              </div>
              <Progress value={totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">In Progress</span>
                <span className="font-medium text-secondary">{inProgressTasks}</span>
              </div>
              <Progress 
                value={totalTasks > 0 ? (inProgressTasks / totalTasks) * 100 : 0} 
                className="h-2"
              />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">Pending</span>
                <span className="font-medium text-warning">{pendingTasks}</span>
              </div>
              <Progress 
                value={totalTasks > 0 ? (pendingTasks / totalTasks) * 100 : 0} 
                className="h-2"
              />
            </div>
          </div>
        </div>

        {/* Subject Performance */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Subject Performance</h3>
          
          {Object.keys(subjectStats).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(subjectStats).map(([subject, stats]: [string, any]) => (
                <div key={subject}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{subject}</span>
                    <span className="font-medium">{stats.completed}/{stats.total}</span>
                  </div>
                  <Progress 
                    value={stats.total > 0 ? (stats.completed / stats.total) * 100 : 0} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No subjects data available.</p>
              <p className="text-sm">Add tasks with subjects to see performance breakdown.</p>
            </div>
          )}
        </div>

        {/* Study Time Analysis */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Study Time Analysis</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Estimated Hours</span>
              <span className="text-lg font-bold text-gray-900">{totalEstimatedHours}h</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Actual Hours</span>
              <span className="text-lg font-bold text-gray-900">{totalActualHours}h</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
              <span className="text-sm font-medium text-primary">Efficiency</span>
              <span className="text-lg font-bold text-primary">
                {totalEstimatedHours > 0 
                  ? `${((totalActualHours / totalEstimatedHours) * 100).toFixed(1)}%`
                  : "N/A"
                }
              </span>
            </div>
          </div>
        </div>

        {/* Weekly Goals */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Goals</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">Tasks Goal</span>
                <span className="font-medium">{completedTasks}/15</span>
              </div>
              <Progress value={(completedTasks / 15) * 100} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">Study Hours Goal</span>
                <span className="font-medium">{totalActualHours}/25h</span>
              </div>
              <Progress value={(totalActualHours / 25) * 100} className="h-2" />
            </div>
            
            <div className="mt-4 p-3 bg-accent/10 rounded-lg">
              <p className="text-sm font-medium text-accent">
                {completedTasks >= 15 && totalActualHours >= 25 
                  ? "🎉 Congratulations! You've achieved all your weekly goals!"
                  : "Keep going! You're making great progress towards your goals."
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
