import { Link, useLocation } from "wouter";
import { Home, Calendar, CheckSquare, BarChart3, Sparkles } from "lucide-react";
import StudyPlannerLogo from "@/components/ui/logo";

export default function DesktopSidebar() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/calendar", label: "Calendar", icon: Calendar },
    { path: "/tasks", label: "Tasks", icon: CheckSquare },
    { path: "/analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:w-72 md:flex md:flex-col z-40">
      <div className="glass-card h-full">
        {/* Header */}
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <StudyPlannerLogo size="md" />
            <div>
              <h1 className="text-xl font-bold text-gradient">StudyFlow</h1>
              <p className="text-xs text-gray-500">Smart Study Planner</p>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location === item.path;
            const Icon = item.icon;
            
            return (
              <Link key={item.path} href={item.path}>
                <div className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer group ${
                  isActive 
                    ? 'gradient-primary text-white shadow-lg transform scale-105' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50 hover:shadow-md hover:scale-105'
                }`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'group-hover:text-violet-600'} transition-colors`} />
                  <span className="font-medium">{item.label}</span>
                  {isActive && <Sparkles className="w-4 h-4 text-white/80 ml-auto" />}
                </div>
              </Link>
            );
          })}
        </nav>
        
        {/* User Profile */}
        <div className="p-4 border-t border-white/20">
          <div className="flex items-center space-x-3 p-4 bg-white/30 rounded-xl backdrop-blur-sm hover:bg-white/40 transition-all duration-300 cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-400 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg">
              AC
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Alex Chen</p>
              <p className="text-sm text-gray-500">Computer Science</p>
            </div>
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          </div>
        </div>
      </div>
    </aside>
  );
}
