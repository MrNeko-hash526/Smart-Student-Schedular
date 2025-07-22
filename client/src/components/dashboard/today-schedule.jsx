import { useTodaysStudySessions } from "@/hooks/use-study-sessions";
import { Plus, Calendar, Clock, Play } from "lucide-react";
import { format } from "date-fns";

export default function TodaySchedule() {
  const { data: sessions, isLoading } = useTodaysStudySessions();

  if (isLoading) {
    return (
      <div className="card-modern p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Today's Schedule</h2>
          </div>
          <Plus className="w-5 h-5 text-gray-400" />
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass-card p-4 animate-pulse">
              <div className="h-4 bg-gray-300 rounded mb-3"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getSubjectGradient = (subject) => {
    if (!subject) return "from-gray-400 to-gray-500";
    
    switch (subject.color) {
      case "#2563EB":
        return "from-blue-500 to-blue-600";
      case "#7C3AED":
        return "from-purple-500 to-purple-600";
      case "#059669":
        return "from-emerald-500 to-emerald-600";
      default:
        return "from-gray-400 to-gray-500";
    }
  };

  return (
    <div className="card-modern p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Today's Schedule</h2>
        </div>
        <button className="btn-primary px-4 py-2 text-sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Session
        </button>
      </div>
      
      {sessions && sessions.length > 0 ? (
        <div className="space-y-4">
          {sessions.map((session) => {
            const startTime = new Date(session.startTime);
            const gradient = getSubjectGradient(session.subject);
            
            return (
              <div key={session.id} className="glass-card p-4 hover-lift">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center text-white font-bold shadow-lg`}>
                      <Clock className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-medium text-gray-600 mt-1">
                      {format(startTime, 'h:mm a')}
                    </p>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{session.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{session.description}</p>
                    <div className="flex items-center space-x-3">
                      {session.subject && (
                        <span className="status-badge bg-white/80 text-gray-700 border-gray-200">
                          {session.subject.name}
                        </span>
                      )}
                      <span className="text-xs text-gray-500 font-medium">
                        {session.actualDuration} minutes
                      </span>
                    </div>
                  </div>
                  <button className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white hover:scale-105 transition-transform shadow-lg">
                    <Play className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">No sessions scheduled</h3>
          <p className="text-gray-500 mb-4">Start your productive day by adding a study session!</p>
          <button className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Add First Session
          </button>
        </div>
      )}
    </div>
  );
}
