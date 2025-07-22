import { useTodaysStudySessions } from "@/hooks/use-study-sessions";
import { Plus } from "lucide-react";
import { format } from "date-fns";

export default function TodaySchedule() {
  const { data: sessions, isLoading } = useTodaysStudySessions();

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Today's Schedule</h2>
          <Plus className="w-5 h-5 text-primary" />
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

  const getSubjectColor = (subject?: any) => {
    if (!subject) return { bgColor: "bg-gray-100", borderColor: "border-gray-400", textColor: "text-gray-700" };
    
    switch (subject.color) {
      case "#2563EB":
        return { bgColor: "bg-primary/5", borderColor: "border-primary", textColor: "text-primary" };
      case "#7C3AED":
        return { bgColor: "bg-secondary/5", borderColor: "border-secondary", textColor: "text-secondary" };
      case "#059669":
        return { bgColor: "bg-accent/5", borderColor: "border-accent", textColor: "text-accent" };
      default:
        return { bgColor: "bg-gray-100", borderColor: "border-gray-400", textColor: "text-gray-700" };
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Today's Schedule</h2>
        <button className="text-primary hover:text-primary/80">
          <Plus className="w-5 h-5" />
        </button>
      </div>
      
      {sessions && sessions.length > 0 ? (
        <div className="space-y-3">
          {sessions.map((session) => {
            const startTime = new Date(session.startTime);
            const colors = getSubjectColor(session.subject);
            
            return (
              <div key={session.id} className={`flex items-center p-3 ${colors.bgColor} rounded-lg border-l-4 ${colors.borderColor}`}>
                <div className="flex-shrink-0 w-12 text-center">
                  <p className="text-sm font-medium text-gray-900">{format(startTime, 'h:mm')}</p>
                  <p className="text-xs text-gray-500">{format(startTime, 'a')}</p>
                </div>
                <div className="ml-4 flex-1">
                  <p className="font-medium text-gray-900">{session.title}</p>
                  <p className="text-sm text-gray-600">{session.description}</p>
                  <p className="text-xs text-gray-500">{session.actualDuration} minutes</p>
                </div>
                <div className="flex-shrink-0">
                  {session.subject && (
                    <span className={`px-2 py-1 text-xs bg-white ${colors.textColor} rounded-full border`}>
                      {session.subject.name}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No study sessions scheduled for today.</p>
          <p className="text-sm">Add a session to get started!</p>
        </div>
      )}
    </div>
  );
}
