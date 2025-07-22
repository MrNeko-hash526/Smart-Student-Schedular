import { Link, useLocation } from "wouter";
import { Home, Calendar, CheckSquare, BarChart3 } from "lucide-react";

export default function MobileNavigation() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/calendar", label: "Calendar", icon: Calendar },
    { path: "/tasks", label: "Tasks", icon: CheckSquare },
    { path: "/analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-card border-t border-white/20 md:hidden z-50 safe-area-bottom">
      <div className="flex justify-around py-3 px-2">
        {navItems.map((item) => {
          const isActive = location === item.path;
          const Icon = item.icon;
          
          return (
            <Link key={item.path} href={item.path}>
              <div className={`flex flex-col items-center px-4 py-2 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-gradient-to-br from-violet-500 to-blue-500 text-white shadow-lg transform scale-110' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
              }`}>
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />
                <span className={`text-xs mt-1 font-medium ${isActive ? 'text-white' : ''}`}>
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
