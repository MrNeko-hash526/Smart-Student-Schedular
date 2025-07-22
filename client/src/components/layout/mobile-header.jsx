import { Bell } from "lucide-react";
import StudyPlannerLogo from "../ui/logo";

export default function MobileHeader() {
  return (
    <header className="md:hidden glass-card border-b border-white/20 px-4 py-4 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <StudyPlannerLogo size="sm" />
          <div>
            <h1 className="text-lg font-bold text-gradient">StudyFlow</h1>
            <p className="text-xs text-gray-500 -mt-1">Smart Study Planner</p>
          </div>
        </div>
        <button className="relative p-2 rounded-xl bg-white/50 hover:bg-white/70 transition-all duration-300">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-red-400 to-pink-500 rounded-full shadow-lg"></span>
        </button>
      </div>
    </header>
  );
}
