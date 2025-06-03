import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, RefreshCw, WifiOff } from 'lucide-react';

interface ErrorUIProps {
  error: string | null;
  onRetry?: () => void;
  onDismiss?: () => void;
  type?: 'error' | 'warning' | 'network';
  showRetry?: boolean;
  autoHide?: boolean;
  autoHideDelay?: number;
}

const ErrorUI: React.FC<ErrorUIProps> = ({
  error,
  onRetry,
  onDismiss,
  type = 'error',
  showRetry = true,
  autoHide = false,
  autoHideDelay = 5000
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    if (error) {
      setIsVisible(true);
      
      if (autoHide) {
        const timer = setTimeout(() => {
          handleDismiss();
        }, autoHideDelay);
        
        return () => clearTimeout(timer);
      }
    } else {
      setIsVisible(false);
    }
  }, [error, autoHide, autoHideDelay]);

  const handleRetry = async () => {
    if (onRetry) {
      setIsRetrying(true);
      try {
        await onRetry();
      } finally {
        setIsRetrying(false);
      }
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onDismiss) {
        onDismiss();
      }
    }, 300); // Wait for fade out animation
  };

  if (!error) return null;

  const getErrorConfig = () => {
    switch (type) {
      case 'network':
        return {
          icon: WifiOff,
          bgColor: 'bg-gradient-to-r from-orange-50 to-amber-50',
          borderColor: 'border-orange-200',
          iconColor: 'text-orange-500',
          titleColor: 'text-orange-800',
          textColor: 'text-orange-700',
          buttonColor: 'bg-orange-500 hover:bg-orange-600',
          title: 'Connection Error'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-gradient-to-r from-yellow-50 to-amber-50',
          borderColor: 'border-yellow-200',
          iconColor: 'text-yellow-500',
          titleColor: 'text-yellow-800',
          textColor: 'text-yellow-700',
          buttonColor: 'bg-yellow-500 hover:bg-yellow-600',
          title: 'Warning'
        };
      default:
        return {
          icon: AlertTriangle,
          bgColor: 'bg-gradient-to-r from-red-50 to-pink-50',
          borderColor: 'border-red-200',
          iconColor: 'text-red-500',
          titleColor: 'text-red-800',
          textColor: 'text-red-700',
          buttonColor: 'bg-red-500 hover:bg-red-600',
          title: 'Error'
        };
    }
  };

  const config = getErrorConfig();
  const IconComponent = config.icon;

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-md transition-all duration-300 ease-in-out transform ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className={`
        ${config.bgColor} 
        ${config.borderColor} 
        border-l-4 
        rounded-lg 
        shadow-lg 
        backdrop-blur-sm 
        p-4 
        space-y-3
        animate-in
        slide-in-from-right
        duration-300
      `}>
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full bg-white/50 ${config.iconColor}`}>
              <IconComponent size={20} />
            </div>
            <div>
              <h3 className={`font-semibold text-sm ${config.titleColor}`}>
                {config.title}
              </h3>
            </div>
          </div>
          
          <button
            onClick={handleDismiss}
            className={`
              ${config.textColor} 
              hover:bg-white/20 
              rounded-full 
              p-1 
              transition-colors 
              duration-200
            `}
          >
            <X size={16} />
          </button>
        </div>

        {/* Error Message */}
        <div className={`${config.textColor} text-sm leading-relaxed pl-11`}>
          {error}
        </div>

        {/* Actions */}
        {(showRetry && onRetry) && (
          <div className="flex justify-end space-x-2 pt-2">
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              className={`
                ${config.buttonColor}
                text-white 
                px-4 
                py-2 
                rounded-md 
                text-sm 
                font-medium 
                transition-colors 
                duration-200 
                flex 
                items-center 
                space-x-2
                disabled:opacity-50 
                disabled:cursor-not-allowed
              `}
            >
              <RefreshCw 
                size={14} 
                className={isRetrying ? 'animate-spin' : ''} 
              />
              <span>{isRetrying ? 'Retrying...' : 'Retry'}</span>
            </button>
          </div>
        )}

        {/* Progress bar for auto-hide */}
        {autoHide && (
          <div className="w-full bg-white/20 rounded-full h-1 overflow-hidden">
            <div 
              className="h-full bg-white/40 rounded-full animate-pulse"
              style={{
                animation: `shrink ${autoHideDelay}ms linear forwards`
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Usage Examples Component
const ErrorUIExamples = () => {
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<'error' | 'warning' | 'network'>('error');

  const triggerError = (type: 'error' | 'warning' | 'network', message: string) => {
    setErrorType(type);
    setError(message);
  };

  const handleRetry = async () => {
    // Simulate retry logic
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Retry attempted');
  };

  const handleDismiss = () => {
    setError(null);
  };

  return (
    <div className="p-8 space-y-4 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Error UI Component</h1>
        
        {/* Demo Buttons */}
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">Try Different Error Types</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => triggerError('error', 'Failed to create meeting. Please check your input and try again.')}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              Show Error
            </button>
            <button
              onClick={() => triggerError('warning', 'Meeting time conflicts with another scheduled meeting.')}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              Show Warning
            </button>
            <button
              onClick={() => triggerError('network', 'Unable to connect to server. Please check your internet connection.')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              Show Network Error
            </button>
          </div>
        </div>

        {/* Usage Code Example */}
        <div className="bg-gray-800 text-gray-100 p-6 rounded-lg overflow-auto">
          <h3 className="text-lg font-semibold mb-4 text-white">Usage Example:</h3>
          <pre className="text-sm">
{`const [error, setError] = useState<string | null>(null);

// In your component render:
{error ? (
  <ErrorUI
    error={error}
    onRetry={() => fetchMeetings()}
    onDismiss={() => setError(null)}
    type="error"
    showRetry={true}
    autoHide={false}
  />
) : (
  <div className="space-y-3">
    {/* Your normal content */}
  </div>
)}`}
          </pre>
        </div>

        {/* Props Documentation */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Props:</h3>
          <div className="space-y-2 text-sm">
            <div><strong>error:</strong> string | null - The error message to display</div>
            <div><strong>onRetry:</strong> () =&gt; void - Function to call when retry button is clicked</div>
            <div><strong>onDismiss:</strong> () =&gt; void - Function to call when error is dismissed</div>
            <div><strong>type:</strong> 'error' | 'warning' | 'network' - Visual style of the error</div>
            <div><strong>showRetry:</strong> boolean - Whether to show retry button</div>
            <div><strong>autoHide:</strong> boolean - Whether to auto-hide after delay</div>
            <div><strong>autoHideDelay:</strong> number - Delay in ms before auto-hide</div>
          </div>
        </div>
      </div>

      {/* Error UI Component */}
      <ErrorUI
        error={error}
        onRetry={handleRetry}
        onDismiss={handleDismiss}
        type={errorType}
        showRetry={true}
        autoHide={false}
      />

    </div>
  );
};

export { ErrorUI };
export default ErrorUIExamples;