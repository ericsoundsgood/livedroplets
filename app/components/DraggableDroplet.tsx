'use client';

import { useState, useRef, useEffect } from 'react';

interface DraggableDropletProps {
  position: { x: number; y: number }; // Percentage values (0-100)
  onPositionChange: (position: { x: number; y: number }) => void;
}

export default function DraggableDroplet({ position, onPositionChange }: DraggableDropletProps) {
  const [isDragging, setIsDragging] = useState(false);
  const dropletRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      // Add padding to keep droplet fully visible (5% from edges)
      const padding = 5;
      const clampedX = Math.max(padding, Math.min(100 - padding, x));
      const clampedY = Math.max(padding, Math.min(100 - padding, y));

      onPositionChange({ x: clampedX, y: clampedY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || !containerRef.current) return;
      e.preventDefault();

      const touch = e.touches[0];
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((touch.clientX - rect.left) / rect.width) * 100;
      const y = ((touch.clientY - rect.top) / rect.height) * 100;

      // Add padding to keep droplet fully visible (5% from edges)
      const padding = 5;
      const clampedX = Math.max(padding, Math.min(100 - padding, x));
      const clampedY = Math.max(padding, Math.min(100 - padding, y));

      onPositionChange({ x: clampedX, y: clampedY });
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, onPositionChange]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
    >
      <div
        ref={dropletRef}
        className={`
          absolute w-16 h-20 
          transform -translate-x-1/2 -translate-y-1/2
          transition-all duration-75
          ${isDragging ? 'scale-110' : 'scale-100 hover:scale-105'}
          no-select
        `}
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* Glass droplet container */}
        <div className="relative w-full h-full">
          {/* Backdrop blur effect - shaped like a droplet */}
          <div 
            className="absolute inset-0"
            style={{
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              clipPath: 'path("M32 8c0 0-24 24-24 40c0 13.255 10.745 24 24 24s24-10.745 24-24c0-16-24-40-24-40z")',
              transform: 'scale(1)',
            }}
          />
          
          {/* Droplet SVG - cleaner, simpler design */}
          <svg
            viewBox="0 0 64 72"
            className={`
              w-full h-full relative z-10
              ${isDragging ? 'animate-pulse' : ''}
            `}
            style={{
              filter: isDragging 
                ? 'drop-shadow(0 0 25px rgba(255, 255, 255, 0.7))' 
                : 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.4))'
            }}
          >
            <defs>
              {/* Simple glass gradient */}
              <linearGradient id="simpleGlassGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
              </linearGradient>
              
              {/* Subtle edge glow */}
              <radialGradient id="edgeGlow" cx="50%" cy="40%">
                <stop offset="70%" stopColor="#ffffff" stopOpacity="0" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.15" />
              </radialGradient>
            </defs>
            
            {/* Main droplet shape - clean and simple */}
            <path
              d="M32 8c0 0-24 24-24 40c0 13.255 10.745 24 24 24s24-10.745 24-24c0-16-24-40-24-40z"
              fill="url(#simpleGlassGradient)"
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="0.5"
              opacity="0.95"
            />
            
            {/* Subtle edge glow for depth */}
            <path
              d="M32 8c0 0-24 24-24 40c0 13.255 10.745 24 24 24s24-10.745 24-24c0-16-24-40-24-40z"
              fill="url(#edgeGlow)"
              opacity="0.7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
} 