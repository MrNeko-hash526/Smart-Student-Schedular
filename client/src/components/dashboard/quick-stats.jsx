import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { CheckSquare, Clock, Trophy, Flame, TrendingUp } from "lucide-react";

export default function QuickStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/stats/dashboard"],
    queryFn: async () => {
      const response = await api.stats.getDashboard();
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card-modern p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded mb-3"></div>
                <div className="h-8 bg-gray-300 rounded"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-2xl"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "Today's Tasks",
      value: stats?.todayTasks || 0,
      icon: CheckSquare,
      gradient: "from-violet-500 to-purple-600",
      change: "+12%",
    },
    {
      title: "Study Hours",
      value: stats?.studyHours || "0h",
      icon: Clock,
      gradient: "from-blue-500 to-cyan-600",
      change: "+8%",
    },
    {
      title: "Completed",
      value: stats?.completed || "0%",
      icon: Trophy,
      gradient: "from-emerald-500 to-green-600",
      change: "+15%",
    },
    {
      title: "Streak",
      value: stats?.streak || "0 days",
      icon: Flame,
      gradient: "from-orange-500 to-red-600",
      change: "+3 days",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {statCards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.title} className="card-modern p-6 hover-lift">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${card.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center space-x-1 text-emerald-600 text-sm font-medium">
                <TrendingUp className="w-3 h-3" />
                <span>{card.change}</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
