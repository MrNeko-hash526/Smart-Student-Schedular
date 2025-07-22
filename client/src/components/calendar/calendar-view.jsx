import { useState } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameDay, isSameMonth, isToday, addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight, Plus, Clock, CheckSquare } from "lucide-react";
import { useTasks } from "@/hooks/use-tasks";
import { useStudySessions } from "@/hooks/use-study-sessions";

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const { data: tasks = [] } = useTasks();
  const { data: sessions = [] } = useStudySessions();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "d";
  const rows = [];
  let days = [];
  let day = startDate;

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const cloneDay = day;
      
      // Get events for this day
      const dayTasks = tasks.filter(task => 
        task.dueDate && isSameDay(new Date(task.dueDate), cloneDay)
      );
      const daySessions = sessions.filter(session => 
        isSameDay(new Date(session.startTime), cloneDay)
      );

      days.push(
        <div
          key={day.toString()}
          className={`min-h-[100px] p-2 border border-gray-100 cursor-pointer transition-all hover:bg-blue-50 ${
            !isSameMonth(day, monthStart) 
              ? "text-gray-400 bg-gray-50" 
              : isToday(day)
                ? "bg-gradient-to-br from-violet-100 to-blue-100 border-violet-300"
                : "bg-white hover:shadow-sm"
          } ${
            isSameDay(day, selectedDate) ? "ring-2 ring-violet-500" : ""
          }`}
          onClick={() => setSelectedDate(cloneDay)}
        >
          <div className="flex justify-between items-start mb-2">
            <span className={`text-sm font-medium ${
              isToday(day) ? "text-violet-700 font-bold" : ""
            }`}>
              {format(day, dateFormat)}
            </span>
            {(dayTasks.length > 0 || daySessions.length > 0) && (
              <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
            )}
          </div>
          
          <div className="space-y-1">
            {/* Study sessions */}
            {daySessions.slice(0, 2).map((session) => (
              <div
                key={session.id}
                className="text-xs p-1 bg-blue-100 text-blue-800 rounded border-l-2 border-blue-500 truncate"
              >
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{format(new Date(session.startTime), 'HH:mm')}</span>
                </div>
                <div className="truncate">{session.title}</div>
              </div>
            ))}
            
            {/* Tasks */}
            {dayTasks.slice(0, 2).map((task) => (
              <div
                key={task.id}
                className={`text-xs p-1 rounded border-l-2 truncate ${
                  task.status === 'completed' 
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-500'
                    : task.priority === 'high'
                      ? 'bg-red-100 text-red-800 border-red-500'
                      : task.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-800 border-yellow-500'
                        : 'bg-gray-100 text-gray-800 border-gray-500'
                }`}
              >
                <div className="flex items-center space-x-1">
                  <CheckSquare className="w-3 h-3" />
                  <span className="truncate">{task.title}</span>
                </div>
              </div>
            ))}
            
            {/* Show more indicator */}
            {(dayTasks.length + daySessions.length) > 2 && (
              <div className="text-xs text-gray-500 text-center">
                +{(dayTasks.length + daySessions.length) - 2} more
              </div>
            )}
          </div>
        </div>
      );
      
      day = addDays(day, 1);
    }
    rows.push(
      <div key={day.toString()} className="grid grid-cols-7">
        {days}
      </div>
    );
    days = [];
  }

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  return (
    <div className="card-modern p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {format(currentDate, "MMMM yyyy")}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <button className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Event
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Week days header */}
        <div className="grid grid-cols-7 bg-gray-50">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="p-3 text-center text-sm font-medium text-gray-600 border-r border-gray-200 last:border-r-0">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar body */}
        <div>{rows}</div>
      </div>

      {/* Selected date details */}
      {selectedDate && (
        <div className="mt-6 glass-card p-4">
          <h3 className="font-semibold text-gray-900 mb-3">
            {format(selectedDate, "EEEE, MMMM d, yyyy")}
          </h3>
          
          <div className="space-y-3">
            {/* Tasks for selected date */}
            {tasks.filter(task => 
              task.dueDate && isSameDay(new Date(task.dueDate), selectedDate)
            ).map((task) => (
              <div key={task.id} className="flex items-center space-x-3 p-2 bg-white rounded-lg border">
                <CheckSquare className={`w-4 h-4 ${
                  task.status === 'completed' ? 'text-emerald-600' : 'text-gray-400'
                }`} />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{task.title}</p>
                  <p className="text-sm text-gray-600">{task.description}</p>
                </div>
                <span className={`status-badge ${
                  task.priority === 'high' ? 'priority-high' :
                  task.priority === 'medium' ? 'priority-medium' : 'priority-low'
                }`}>
                  {task.priority}
                </span>
              </div>
            ))}

            {/* Sessions for selected date */}
            {sessions.filter(session => 
              isSameDay(new Date(session.startTime), selectedDate)
            ).map((session) => (
              <div key={session.id} className="flex items-center space-x-3 p-2 bg-white rounded-lg border">
                <Clock className="w-4 h-4 text-blue-600" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{session.title}</p>
                  <p className="text-sm text-gray-600">
                    {format(new Date(session.startTime), 'h:mm a')} - 
                    {format(new Date(session.endTime), 'h:mm a')}
                  </p>
                </div>
                <span className="status-badge bg-blue-100 text-blue-800 border-blue-200">
                  {session.actualDuration} min
                </span>
              </div>
            ))}

            {tasks.filter(task => 
              task.dueDate && isSameDay(new Date(task.dueDate), selectedDate)
            ).length === 0 && 
            sessions.filter(session => 
              isSameDay(new Date(session.startTime), selectedDate)
            ).length === 0 && (
              <p className="text-gray-500 text-center py-4">No events scheduled for this day</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}