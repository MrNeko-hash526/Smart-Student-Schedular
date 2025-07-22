import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useTasks } from "@/hooks/use-tasks";
import { TrendingUp, Target, Clock, BookOpen, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function StatsCards() {
  const { data: tasks, isLoading: tasksLoading } = useTasks();
  
  const { data: dashboardStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/stats/dashboard"],
    queryFn: async () => {
      const response = await api.stats.getDashboard();
      return response.json();
    },
  });

  const isLoading = tasksLoading || statsLoading;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-8 bg-gray-300 rounded w-16"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Calculate analytics from tasks data
  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter(task => task.status === "completed").length || 0;
  const inProgressTasks = tasks?.filter(task => task.status === "in-progress").length || 0;
  const pendingTasks = tasks?.filter(task => task.status === "pending").length || 0;
  const highPriorityTasks = tasks?.filter(task => task.priority === "high" && task.status !== "completed").length || 0;
  
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const totalEstimatedHours = tasks?.reduce((sum, task) => sum + (task.estimatedHours || 0), 0) || 0;
  const totalActualHours = tasks?.reduce((sum, task) => sum + (task.actualHours || 0), 0) || 0;
  
  // Get unique subjects
  const subjectCount = new Set(tasks?.map(task => task.subject?.id).filter(Boolean)).size;

  const statsCards = [
    {
      title: "Completion Rate",
      value: `${completionRate}%`,
      icon: TrendingUp,
      color: "text-accent",
      bgColor: "bg-accent/10",
      trend: completionRate >= 80 ? "high" : completionRate >= 60 ? "medium" : "low",
    },
    {
      title: "Total Tasks",
      value: totalTasks,
      icon: Target,
      color: "text-primary",
      bgColor: "bg-primary/10",
      trend: "neutral",
    },
    {
      title: "Completed",
      value: completedTasks,
      icon: CheckCircle,
      color: "text-accent",
      bgColor: "bg-accent/10",
      trend: "high",
    },
    {
      title: "In Progress",
      value: inProgressTasks,
      icon: Clock,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      trend: "medium",
    },
    {
      title: "High Priority",
      value: highPriorityTasks,
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      trend: highPriorityTasks > 5 ? "high" : highPriorityTasks > 2 ? "medium" : "low",
    },
    {
      title: "Active Subjects",
      value: subjectCount,
      icon: BookOpen,
      color: "text-warning",
      bgColor: "bg-warning/10",
      trend: "neutral",
    },
  ];

  const getTrendIndicator = (trend: string) => {
    switch (trend) {
      case "high":
        return <div className="w-2 h-2 bg-green-500 rounded-full"></div>;
      case "medium":
        return <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>;
      case "low":
        return <div className="w-2 h-2 bg-red-500 rounded-full"></div>;
      default:
        return <div className="w-2 h-2 bg-gray-400 rounded-full"></div>;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {statsCards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="transition-all duration-200 hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="text-sm font-medium text-gray-600">{card.title}</p>
                    {getTrendIndicator(card.trend)}
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                </div>
                <div className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
