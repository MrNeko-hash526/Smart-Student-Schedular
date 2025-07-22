import { useTasks } from "@/hooks/use-tasks";
import { Progress } from "@/components/ui/progress";
import { Trophy } from "lucide-react";

export default function ProgressOverview() {
  const { data: tasks, isLoading } = useTasks();

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">This Week's Progress</h3>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-2 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter(task => task.status === "completed").length || 0;
  const inProgressTasks = tasks?.filter(task => task.status === "in-progress").length || 0;

  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const progressRate = totalTasks > 0 ? ((completedTasks + inProgressTasks) / totalTasks) * 100 : 0;

  // Mock data for study hours and focus sessions
  const studyHours = { completed: 18, target: 25 };
  const focusSessions = { completed: 8, target: 10 };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">This Week's Progress</h3>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-700">Tasks Completed</span>
            <span className="font-medium">{completedTasks}/{totalTasks}</span>
          </div>
          <Progress value={completionRate} className="h-2" />
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-700">Study Hours</span>
            <span className="font-medium">{studyHours.completed}/{studyHours.target} hours</span>
          </div>
          <Progress 
            value={(studyHours.completed / studyHours.target) * 100} 
            className="h-2"
          />
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-700">Focus Sessions</span>
            <span className="font-medium">{focusSessions.completed}/{focusSessions.target}</span>
          </div>
          <Progress 
            value={(focusSessions.completed / focusSessions.target) * 100} 
            className="h-2"
          />
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-accent/10 rounded-lg">
        <div className="flex items-center">
          <Trophy className="w-5 h-5 text-accent mr-2" />
          <span className="text-sm font-medium text-accent">
            Great progress! You're on track to meet your weekly goals.
          </span>
        </div>
      </div>
    </div>
  );
}
