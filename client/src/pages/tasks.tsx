import { useState } from "react";
import { useTasks } from "@/hooks/use-tasks";
import TaskList from "@/components/tasks/task-list";
import TaskForm from "@/components/tasks/task-form";
import CompletedTasks from "@/components/tasks/completed-tasks";
import { Button } from "@/components/ui/button";
import { Plus, CheckSquare, ListTodo, Trophy } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Tasks() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { data: tasks = [], isLoading } = useTasks();

  const activeTasks = tasks.filter(task => task.status !== 'completed');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="card-modern p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center shadow-lg">
              <CheckSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gradient">Tasks</h1>
              <p className="text-gray-600">Manage your study tasks and assignments</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-2 shadow-lg">
                  <ListTodo className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-lg font-bold text-gray-900">{activeTasks.length}</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center mb-2 shadow-lg">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-lg font-bold text-gray-900">{completedTasks.length}</p>
              </div>
            </div>
            
            <Button onClick={() => setShowCreateForm(true)} className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>
      </div>

      {showCreateForm && (
        <div className="card-modern p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Task</h3>
          <TaskForm onCancel={() => setShowCreateForm(false)} />
        </div>
      )}

      {/* Tasks Tabs */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="active" className="flex items-center space-x-2">
            <ListTodo className="w-4 h-4" />
            <span>Active Tasks ({activeTasks.length})</span>
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center space-x-2">
            <Trophy className="w-4 h-4" />
            <span>Completed ({completedTasks.length})</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          <TaskList />
        </TabsContent>
        
        <TabsContent value="completed">
          <CompletedTasks />
        </TabsContent>
      </Tabs>
    </div>
  );
}
