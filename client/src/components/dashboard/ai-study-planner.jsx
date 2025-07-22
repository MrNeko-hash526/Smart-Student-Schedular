import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useUpcomingTasks } from "@/hooks/use-tasks";
import { api } from "@/lib/api";
import { Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function AIStudyPlanner() {
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  const [availableHours, setAvailableHours] = useState("3");
  const [difficultyLevel, setDifficultyLevel] = useState("medium");
  
  const { data: upcomingTasks } = useUpcomingTasks();
  const { toast } = useToast();

  const generatePlanMutation = useMutation({
    mutationFn: async () => {
      if (!selectedTaskId) throw new Error("Please select a task");
      
      const response = await api.studyPlan.generate({
        taskId: parseInt(selectedTaskId),
        availableHours: parseInt(availableHours),
        difficultyLevel,
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Study Plan Generated!",
        description: `Created ${data.totalSessions} study sessions for optimal learning.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to generate study plan",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 text-white">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
          <Brain className="w-5 h-5" />
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold">AI Study Plan Generator</h3>
          <p className="text-white/80 text-sm">Let AI optimize your study schedule</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="bg-white/10 rounded-lg p-4">
          <Label className="block text-sm font-medium mb-2">Upcoming Deadline</Label>
          <Select value={selectedTaskId} onValueChange={setSelectedTaskId}>
            <SelectTrigger className="w-full bg-white/20 border-white/30 text-white">
              <SelectValue placeholder="Select a task" />
            </SelectTrigger>
            <SelectContent>
              {upcomingTasks?.map((task) => (
                <SelectItem key={task.id} value={task.id.toString()}>
                  {task.title} - {task.subject?.name}
                </SelectItem>
              )) || []}
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/10 rounded-lg p-3">
            <Label className="block text-xs font-medium mb-1">Available Hours/Day</Label>
            <Input
              type="number"
              value={availableHours}
              onChange={(e) => setAvailableHours(e.target.value)}
              className="w-full bg-white/20 border-white/30 text-white placeholder:text-white/60"
              min="1"
              max="8"
            />
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <Label className="block text-xs font-medium mb-1">Difficulty Level</Label>
            <Select value={difficultyLevel} onValueChange={setDifficultyLevel}>
              <SelectTrigger className="w-full bg-white/20 border-white/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button
          onClick={() => generatePlanMutation.mutate()}
          disabled={generatePlanMutation.isPending || !selectedTaskId}
          className="w-full bg-white text-primary font-medium hover:bg-white/90 transition-colors"
        >
          <Brain className="w-4 h-4 mr-2" />
          {generatePlanMutation.isPending ? "Generating..." : "Generate Smart Plan"}
        </Button>
      </div>
    </div>
  );
}
