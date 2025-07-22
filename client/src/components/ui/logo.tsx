import { BookOpen, Brain, Sparkles } from "lucide-react";

export default function StudyPlannerLogo({ size = "md", className = "" }) {
  const sizes = {
    sm: { container: "w-8 h-8", icon: "w-4 h-4", sparkle: "w-2 h-2" },
    md: { container: "w-12 h-12", icon: "w-6 h-6", sparkle: "w-3 h-3" },
    lg: { container: "w-16 h-16", icon: "w-8 h-8", sparkle: "w-4 h-4" },
    xl: { container: "w-20 h-20", icon: "w-10 h-10", sparkle: "w-5 h-5" }
  };

  const sizeClasses = sizes[size as keyof typeof sizes] || sizes.md;

  return (
    <div className={`relative ${sizeClasses.container} ${className}`}>
      {/* Main gradient background */}
      <div className="gradient-primary w-full h-full rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full"></div>
          <div className="absolute bottom-2 left-1 w-1 h-1 bg-white rounded-full"></div>
        </div>
        
        {/* Main icon */}
        <div className="relative z-10">
          <BookOpen className={`${sizeClasses.icon} text-white`} />
        </div>
        
        {/* Smart indicator */}
        <div className="absolute -top-1 -right-1 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-1 shadow-lg">
          <Brain className={`${sizeClasses.sparkle} text-white`} />
        </div>
      </div>
      
      {/* Floating sparkles */}
      <div className="absolute -top-1 -left-1 animate-pulse">
        <Sparkles className={`${sizeClasses.sparkle} text-violet-400`} />
      </div>
      <div className="absolute -bottom-1 -right-1 animate-pulse delay-300">
        <Sparkles className={`${sizeClasses.sparkle} text-blue-400`} />
      </div>
    </div>
  );
}