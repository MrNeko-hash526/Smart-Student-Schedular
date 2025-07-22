import { useTasks } from "@/hooks/use-tasks";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Clock, Star } from "lucide-react";

export default function ProgressCharts() {
  const { data: tasks, isLoading } = useTasks();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-32"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-2 bg-gray-100 rounded"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter(task => task.status === "completed").length || 0;
  const inProgressTasks = tasks?.filter(task => task.status === "in-progress").length || 0;
  const pendingTasks = tasks?.filter(task => task.status === "pending").length || 0;

  // Subject breakdown
  const subjectStats = tasks?.reduce((acc: any, task) => {
    const subjectName = task.subject?.name || "Other";
    const subjectColor = task.subject?.color || "#6B7280";
    
    if (!acc[subjectName]) {
      acc[subjectName] = { total: 0, completed: 0, color: subjectColor };
    }
    acc[subjectName].total++;
    if (task.status === "completed") {
      acc[subjectName].completed++;
    }
    return acc;
  }, {}) || {};

  // Priority breakdown
  const priorityStats = {
    high: { total: 0, completed: 0, color: "#DC2626" },
    medium: { total: 0, completed: 0, color: "#D97706" },
    low: { total: 0, completed: 0, color: "#059669" },
  };

  tasks?.forEach(task => {
    const priority = task.priority as keyof typeof priorityStats;
    if (priorityStats[priority]) {
      priorityStats[priority].total++;
      if (task.status === "completed") {
        priorityStats[priority].completed++;
      }
    }
  });

  // Time analysis
  const totalEstimatedHours = tasks?.reduce((sum, task) => sum + (task.estimatedHours || 0), 0) || 0;
  const totalActualHours = tasks?.reduce((sum, task) => sum + (task.actualHours || 0), 0) || 0;
  const efficiency = totalEstimatedHours > 0 ? (totalActualHours / totalEstimatedHours) * 100 : 0;

  // Weekly goals (mock data for demo)
  const weeklyGoals = {
    tasks: { completed: completedTasks, target: 15 },
    hours: { completed: totalActualHours, target: 25 },
    subjects: { completed: Object.keys(subjectStats).length, target: 4 },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Task Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Task Status Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Completed</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-accent">{completedTasks}</span>
                  <Badge className="bg-accent/10 text-accent border-accent/20">
                    {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
                  </Badge>
                </div>
              </div>
              <Progress 
                value={totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0} 
                className="h-3"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">In Progress</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-secondary">{inProgressTasks}</span>
                  <Badge className="bg-secondary/10 text-secondary border-secondary/20">
                    {totalTasks > 0 ? Math.round((inProgressTasks / totalTasks) * 100) : 0}%
                  </Badge>
                </div>
              </div>
              <Progress 
                value={totalTasks > 0 ? (inProgressTasks / totalTasks) * 100 : 0} 
                className="h-3"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Pending</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-warning">{pendingTasks}</span>
                  <Badge className="bg-warning/10 text-warning border-warning/20">
                    {totalTasks > 0 ? Math.round((pendingTasks / totalTasks) * 100) : 0}%
                  </Badge>
                </div>
              </div>
              <Progress 
                value={totalTasks > 0 ? (pendingTasks / totalTasks) * 100 : 0} 
                className="h-3"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subject Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-accent" />
            Subject Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(subjectStats).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(subjectStats).map(([subject, stats]: [string, any]) => (
                <div key={subject}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">{subject}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">{stats.completed}/{stats.total}</span>
                      <Badge 
                        style={{ 
                          backgroundColor: `${stats.color}20`,
                          color: stats.color,
                          borderColor: `${stats.color}40`
                        }}
                      >
                        {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                      </Badge>
                    </div>
                  </div>
                  <Progress 
                    value={stats.total > 0 ? (stats.completed / stats.total) * 100 : 0} 
                    className="h-3"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No subject data available.</p>
              <p className="text-sm">Add tasks with subjects to see performance breakdown.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Time Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-secondary" />
            Time Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Estimated</p>
                <p className="text-2xl font-bold text-gray-900">{totalEstimatedHours}h</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Actual</p>
                <p className="text-2xl font-bold text-gray-900">{totalActualHours}h</p>
              </div>
            </div>
            
            <div className="bg-primary/10 rounded-lg p-4 text-center">
              <p className="text-sm text-primary mb-1">Time Efficiency</p>
              <p className="text-2xl font-bold text-primary">
                {efficiency.toFixed(1)}%
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Priority Distribution</span>
              </div>
              <div className="space-y-2">
                {Object.entries(priorityStats).map(([priority, stats]) => (
                  <div key={priority} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: stats.color }}
                      ></div>
                      <span className="text-sm capitalize">{priority}</span>
                    </div>
                    <span className="text-sm font-medium">{stats.completed}/{stats.total}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-warning" />
            Weekly Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-700">Tasks Completed</span>
                <span className="font-medium">{weeklyGoals.tasks.completed}/{weeklyGoals.tasks.target}</span>
              </div>
              <Progress value={(weeklyGoals.tasks.completed / weeklyGoals.tasks.target) * 100} className="h-3" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-700">Study Hours</span>
                <span className="font-medium">{weeklyGoals.hours.completed}/{weeklyGoals.hours.target}h</span>
              </div>
              <Progress value={(weeklyGoals.hours.completed / weeklyGoals.hours.target) * 100} className="h-3" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-700">Active Subjects</span>
                <span className="font-medium">{weeklyGoals.subjects.completed}/{weeklyGoals.subjects.target}</span>
              </div>
              <Progress value={(weeklyGoals.subjects.completed / weeklyGoals.subjects.target) * 100} className="h-3" />
            </div>
            
            <div className="mt-4 p-3 bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg">
              <p className="text-sm font-medium text-center">
                {weeklyGoals.tasks.completed >= weeklyGoals.tasks.target && 
                 weeklyGoals.hours.completed >= weeklyGoals.hours.target 
                  ? "🎉 Congratulations! You've achieved your weekly goals!"
                  : "Keep going! You're making great progress towards your goals."
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
