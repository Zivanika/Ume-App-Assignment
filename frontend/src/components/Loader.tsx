import { Loader2 } from "lucide-react";

export default function AnimatedLoader({ 
  size = 34, 
  className = "", 
  text = "Loading..." 
}) {
  return (
    <div className="min-h-60 flex flex-col items-center justify-center space-y-2">
      <Loader2 
        size={size} 
        className={`animate-spin text-purple-600 ${className}`} 
      />
      {text && (
        <p className="text-sm text-gray-600 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}