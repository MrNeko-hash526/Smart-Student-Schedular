import { useTasks } from "@/hooks/use-tasks";
import { format } from "date-fns";
import { CheckCircle2, Trophy, Calendar, Clock, RotateCcw } from "lucide-react";
import { useUpdateTask } from "@/hooks/use-tasks";

export default function CompletedTasks() {
  const { data: allTasks = [], isLoading } = useTasks();
  const updateTaskMutation = useUpdateTask();
  
  const completedTasks = allTasks.filter(task => task.status === 'completed');

  const handleMarkIncomplete = async (taskId: number) => {
    await updateTaskMutation.mutateAsync({
      id: taskId,
      task: { status: 'pending' }
    });
  };

  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return 'status-pending';
    }
  };

  if (isLoading) {
    return (
      <div className="card-modern p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Completed Tasks</h2>
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

  return (
    <div className="card-modern p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Completed Tasks</h2>
            <p className="text-sm text-gray-600">{completedTasks.length} tasks completed</p>
          </div>
        </div>
        
        {completedTasks.length > 0 && (
          <div className="flex items-center space-x-2 text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-medium">Great work!</span>
          </div>
        )}
      </div>

      {completedTasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">No completed tasks yet</h3>
          <p className="text-gray-500">Complete some tasks to see them here and track your progress!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {completedTasks.map((task) => (
            <div key={task.id} className="glass-card p-4 hover-lift border-l-4 border-emerald-500">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center mt-1">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{task.title}</h3>
                    {task.description && (
                      <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                    )}
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      {task.subject && (
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{task.subject.name}</span>
                        </span>
                      )}
                      {task.estimatedHours && (
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{task.estimatedHours}h estimated</span>
                        </span>
                      )}
                      {task.completedAt && (
                        <span className="flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Completed {format(new Date(task.completedAt), 'MMM d, yyyy')}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className={`status-badge ${getPriorityBadge(task.priority)}`}>
                    {task.priority}
                  </span>
                  <button
                    onClick={() => handleMarkIncomplete(task.id)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                    title="Mark as incomplete"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats summary */}
      {completedTasks.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl">
              <div className="text-2xl font-bold text-emerald-700">{completedTasks.length}</div>
              <div className="text-sm text-emerald-600">Tasks Completed</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
              <div className="text-2xl font-bold text-blue-700">
                {completedTasks.reduce((sum, task) => sum + (task.estimatedHours || 0), 0)}h
              </div>
              <div className="text-sm text-blue-600">Hours Studied</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl">
              <div className="text-2xl font-bold text-violet-700">
                {Math.round((completedTasks.length / allTasks.length) * 100)}%
              </div>
              <div className="text-sm text-violet-600">Completion Rate</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}