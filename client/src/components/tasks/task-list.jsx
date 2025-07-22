import { useTasks, useUpdateTask, useDeleteTask } from "@/hooks/use-tasks";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Edit, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";

interface TaskListProps {
  filter?: "all" | "pending" | "completed" | "in-progress";
  showSubject?: boolean;
  limit?: number;
}

export default function TaskList({ filter = "all", showSubject = true, limit }: TaskListProps) {
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
        return "bg-red-100 text-red-700 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-accent/10 text-accent border-accent/20";
      case "in-progress":
        return "bg-secondary/10 text-secondary border-secondary/20";
      case "pending":
        return "bg-warning/10 text-warning border-warning/20";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(limit || 5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-4 h-4 bg-gray-200 rounded mt-1"></div>
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-100 rounded w-2/3 mb-2"></div>
                  <div className="flex space-x-2">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  let filteredTasks = tasks || [];

  if (filter !== "all") {
    filteredTasks = filteredTasks.filter(task => task.status === filter);
  }

  if (limit) {
    filteredTasks = filteredTasks.slice(0, limit);
  }

  // Sort tasks: pending/in-progress first, then by due date, then by priority
  filteredTasks.sort((a, b) => {
    // Completed tasks go to bottom
    if (a.status === "completed" && b.status !== "completed") return 1;
    if (b.status === "completed" && a.status !== "completed") return -1;

    // Sort by due date if both have dates
    if (a.dueDate && b.dueDate) {
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);
      if (dateA.getTime() !== dateB.getTime()) {
        return dateA.getTime() - dateB.getTime();
      }
    }

    // Tasks with due dates come before those without
    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;

    // Sort by priority
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) - 
           (priorityOrder[a.priority as keyof typeof priorityOrder] || 0);
  });

  if (filteredTasks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="text-lg font-medium mb-2">
          {filter === "completed" ? "No completed tasks" : 
           filter === "pending" ? "No pending tasks" :
           filter === "in-progress" ? "No tasks in progress" :
           "No tasks found"}
        </p>
        <p className="text-sm">
          {filter === "all" ? "Add a task to get started!" : 
           filter === "completed" ? "Complete some tasks to see them here!" :
           "Tasks will appear here as they match this status."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredTasks.map((task) => (
        <Card key={task.id} className={`transition-all duration-200 hover:shadow-md ${
          task.status === "completed" ? "opacity-70" : ""
        }`}>
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                checked={task.status === "completed"}
                onCheckedChange={() => handleToggleComplete(task.id, task.status)}
                className="mt-1 data-[state=checked]:bg-accent data-[state=checked]:border-accent"
              />
              
              <div className="flex-1 min-w-0">
                <h3 className={`font-medium text-gray-900 ${
                  task.status === "completed" ? "line-through" : ""
                }`}>
                  {task.title}
                </h3>
                
                {task.description && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {task.description}
                  </p>
                )}
                
                <div className="flex items-center flex-wrap gap-2 mt-3">
                  <Badge variant="outline" className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                  
                  <Badge variant="outline" className={getStatusColor(task.status)}>
                    {task.status === "in-progress" ? "In Progress" : 
                     task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                  </Badge>
                  
                  {showSubject && task.subject && (
                    <Badge 
                      variant="outline" 
                      style={{ 
                        backgroundColor: `${task.subject.color}10`,
                        borderColor: `${task.subject.color}40`,
                        color: task.subject.color 
                      }}
                    >
                      {task.subject.name}
                    </Badge>
                  )}
                  
                  {task.estimatedHours && (
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {task.estimatedHours}h estimated
                    </div>
                  )}
                  
                  {task.dueDate && (
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      Due {format(new Date(task.dueDate), "MMM d")}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
