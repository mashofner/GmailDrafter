import React, { useEffect, useState } from 'react';

interface ProgressBarProps {
  isLoading: boolean;
  duration?: number; // Duration in milliseconds
  color?: string;
  height?: number;
  className?: string;
  indeterminate?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  isLoading,
  duration = 3000,
  color = 'bg-comerian-teal',
  height = 3,
  className = '',
  indeterminate = false
}) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    let startTime: number;
    let animationFrame: number;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const nextProgress = Math.min(elapsed / duration * 100, 99.5);
      
      setProgress(nextProgress);
      
      if (elapsed < duration && isLoading) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    if (isLoading) {
      // Reset progress when loading starts
      setProgress(0);
      
      if (indeterminate) {
        // For indeterminate progress, just show the animation
        setProgress(30);
      } else {
        // Start the animation
        startTime = performance.now();
        animationFrame = requestAnimationFrame(animate);
      }
    } else if (progress > 0) {
      // When loading completes, quickly finish the progress bar
      setProgress(100);
      timer = setTimeout(() => {
        setProgress(0);
      }, 300);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [isLoading, duration, indeterminate]);
  
  if (progress === 0) return null;
  
  return (
    <div 
      className={`fixed top-0 left-0 right-0 z-50 ${className}`}
      style={{ height: `${height}px` }}
    >
      <div 
        className={`h-full ${color} transition-all duration-300 ease-out ${indeterminate ? 'animate-progress-indeterminate' : ''}`}
        style={{ 
          width: `${progress}%`,
          transition: indeterminate ? 'none' : 'width 0.3s ease-out'
        }}
      />
    </div>
  );
};

export default ProgressBar;