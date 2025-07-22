import { CheckSquare, Plus, Clock, Star } from "lucide-react";

export default function RecentActivity() {
  // Mock recent activity data - in a real app, this would come from API
  const activities = [
    {
      id: 1,
      type: "completed",
      description: "Completed Linear Algebra homework",
      time: "2 hours ago",
      icon: CheckSquare,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      id: 2,
      type: "created",
      description: "Added CS project milestone",
      time: "4 hours ago",
      icon: Plus,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      id: 3,
      type: "studied",
      description: "Studied for 2.5 hours",
      time: "Yesterday",
      icon: Clock,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      id: 4,
      type: "achievement",
      description: "Achieved 7-day study streak",
      time: "Yesterday",
      icon: Star,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      
      <div className="space-y-3">
        {activities.map((activity) => {
          const Icon = activity.icon;
          
          return (
            <div key={activity.id} className="flex items-start">
              <div className={`flex-shrink-0 w-8 h-8 ${activity.bgColor} rounded-full flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${activity.color}`} />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm text-gray-900">{activity.description}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
