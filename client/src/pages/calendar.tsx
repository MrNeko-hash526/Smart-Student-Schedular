import CalendarView from "@/components/calendar/calendar-view";
import { Calendar as CalendarIcon, Target, TrendingUp } from "lucide-react";

export default function Calendar() {
  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="card-modern p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center shadow-lg">
              <CalendarIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gradient">Calendar</h1>
              <p className="text-gray-600">View and manage your study schedule</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center mb-2 shadow-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-lg font-bold text-gray-900">8 Events</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-2 shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-medium text-gray-600">Completion</p>
              <p className="text-lg font-bold text-gray-900">75%</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Calendar Component */}
      <CalendarView />
    </div>
  );
}
