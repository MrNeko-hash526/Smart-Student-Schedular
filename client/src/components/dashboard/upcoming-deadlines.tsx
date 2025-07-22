import { useUpcomingTasks } from "@/hooks/use-tasks";
import { format, differenceInDays } from "date-fns";

export default function UpcomingDeadlines() {
  const { data: tasks, isLoading } = useUpcomingTasks();

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Deadlines</h3>
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-3 bg-gray-100 rounded-lg animate-pulse">
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getPriorityColor = (priority: string, daysLeft: number) => {
    if (daysLeft <= 2) return { bg: "bg-red-50", border: "border-red-500", text: "text-red-600", badge: "bg-red-100 text-red-700" };
    if (daysLeft <= 7) return { bg: "bg-yellow-50", border: "border-yellow-500", text: "text-yellow-600", badge: "bg-yellow-100 text-yellow-700" };
    return { bg: "bg-blue-50", border: "border-blue-500", text: "text-blue-600", badge: "bg-blue-100 text-blue-700" };
  };

  const sortedTasks = tasks?.sort((a, b) => {
    if (!a.dueDate || !b.dueDate) return 0;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Upcoming Deadlines</h3>
        <button className="text-primary text-sm hover:text-primary/80">View All</button>
      </div>
      
      {sortedTasks && sortedTasks.length > 0 ? (
        <div className="space-y-3">
          {sortedTasks.slice(0, 3).map((task) => {
            if (!task.dueDate) return null;
            
            const dueDate = new Date(task.dueDate);
            const daysLeft = differenceInDays(dueDate, new Date());
            const colors = getPriorityColor(task.priority, daysLeft);
            
            return (
              <div key={task.id} className={`flex items-center justify-between p-3 ${colors.bg} rounded-lg border-l-4 ${colors.border}`}>
                <div>
                  <p className="font-medium text-gray-900">{task.title}</p>
                  <p className="text-sm text-gray-600">{task.subject?.code || "General"}</p>
                  <p className={`text-xs ${colors.text}`}>
                    {daysLeft <= 0 ? "Due today" : `${daysLeft} days left`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{format(dueDate, "MMM d")}</p>
                  <span className={`px-2 py-1 text-xs ${colors.badge} rounded-full`}>
                    {daysLeft <= 2 ? "Urgent" : daysLeft <= 7 ? "Medium" : "Low"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No upcoming deadlines.</p>
          <p className="text-sm">Great job staying on top of things!</p>
        </div>
      )}
    </div>
  );
}
