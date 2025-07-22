import { useTasks, useUpdateTask, useDeleteTask } from "@/hooks/use-tasks";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Edit } from "lucide-react";
import { format } from "date-fns";

export default function Tasks() {
  const { data: tasks, isLoading } = useTasks();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  const handleToggleComplete = async (taskId: number, currentStatus: string) => {
    const newStatus = currentStatus === "completed" ? "pending" : "completed";
    updateTaskMutation.mutate({ id: taskId, task: { status: newStatus } });
  };

  const handleDeleteTask = async (taskId: number) => {
    if (confirm("Are you sure you want to delete this task?")) {
      deleteTaskMutation.mutate(taskId);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-8">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Tasks</h1>
          <p className="text-gray-600">Manage your study tasks and assignments.</p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="border-b border-gray-200 pb-4 animate-pulse">
                <div className="h-5 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-100 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const pendingTasks = tasks?.filter(task => task.status !== "completed") || [];
  const completedTasks = tasks?.filter(task => task.status === "completed") || [];

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Tasks</h1>
        <p className="text-gray-600">Manage your study tasks and assignments.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Tasks */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Pending Tasks ({pendingTasks.length})
          </h2>
          
          {pendingTasks.length > 0 ? (
            <div className="space-y-4">
              {pendingTasks.map((task) => (
                <div key={task.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      checked={task.status === "completed"}
                      onCheckedChange={() => handleToggleComplete(task.id, task.status)}
                      className="mt-1"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{task.title}</h3>
                      {task.description && (
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                      )}
                      
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        
                        {task.subject && (
                          <Badge variant="outline">{task.subject.name}</Badge>
                        )}
                        
                        {task.dueDate && (
                          <span className="text-xs text-gray-500">
                            Due: {format(new Date(task.dueDate), "MMM d, yyyy")}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No pending tasks.</p>
              <p className="text-sm">Add a task from the dashboard to get started!</p>
            </div>
          )}
        </div>

        {/* Completed Tasks */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Completed Tasks ({completedTasks.length})
          </h2>
          
          {completedTasks.length > 0 ? (
            <div className="space-y-4">
              {completedTasks.map((task) => (
                <div key={task.id} className="border-b border-gray-200 pb-4 last:border-b-0 opacity-60">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      checked={true}
                      onCheckedChange={() => handleToggleComplete(task.id, task.status)}
                      className="mt-1"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 line-through">{task.title}</h3>
                      {task.description && (
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                      )}
                      
                      <div className="flex items-center space-x-2 mt-2">
                        {task.subject && (
                          <Badge variant="outline">{task.subject.name}</Badge>
                        )}
                        
                        {task.completedAt && (
                          <span className="text-xs text-gray-500">
                            Completed: {format(new Date(task.completedAt), "MMM d, yyyy")}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No completed tasks yet.</p>
              <p className="text-sm">Complete some tasks to see them here!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
