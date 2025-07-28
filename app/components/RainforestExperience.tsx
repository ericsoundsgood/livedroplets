'use client';

import { useState, useRef, useEffect } from 'react';
import DraggableDroplet from './DraggableDroplet';

// Declare YouTube IFrame API types
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function RainforestExperience() {
  const [dropletPosition, setDropletPosition] = useState({ x: 50, y: 50 }); // Percentage
  const [isStarted, setIsStarted] = useState(false);
  const [videosFadedIn, setVideosFadedIn] = useState(false);
  const [audioFadeValue, setAudioFadeValue] = useState(0); // 0 to 1 for smooth fade
  const [playersReady, setPlayersReady] = useState(false);
  const dayIframeRef = useRef<HTMLIFrameElement>(null);
  const nightIframeRef = useRef<HTMLIFrameElement>(null);
  const dayPlayerRef = useRef<any>(null);
  const nightPlayerRef = useRef<any>(null);
  const audioFadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load YouTube IFrame API
  useEffect(() => {
    if (isStarted && !window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        initializePlayers();
      };
    } else if (isStarted && window.YT) {
      initializePlayers();
    }
  }, [isStarted]);

  // Initialize YouTube players
  const initializePlayers = () => {
    if (dayIframeRef.current && nightIframeRef.current && window.YT?.Player) {
      dayPlayerRef.current = new window.YT.Player(dayIframeRef.current, {
        events: {
          onReady: (event: any) => {
            checkPlayersReady();
          }
        }
      });

      nightPlayerRef.current = new window.YT.Player(nightIframeRef.current, {
        events: {
          onReady: (event: any) => {
            checkPlayersReady();
          }
        }
      });
    }
  };

  const checkPlayersReady = () => {
    if (dayPlayerRef.current && nightPlayerRef.current) {
      // Add a small delay to ensure API is fully ready
      setTimeout(() => {
        try {
          // Test if the methods are available
          if (typeof dayPlayerRef.current.setVolume === 'function' && 
              typeof nightPlayerRef.current.setVolume === 'function') {
            setPlayersReady(true);
            // Set initial volumes to 0 for fade-in effect
            dayPlayerRef.current.setVolume(0);
            nightPlayerRef.current.setVolume(0);
            
            // iOS specific: Try to play videos programmatically
            // This only works if triggered by user interaction (the click to start)
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
            if (isIOS && typeof dayPlayerRef.current.playVideo === 'function') {
              try {
                dayPlayerRef.current.playVideo();
                nightPlayerRef.current.playVideo();
              } catch (e) {
                console.log('iOS autoplay attempt:', e);
              }
            }
          }
        } catch (error) {
          console.error('Error setting initial volumes:', error);
          // Retry after another delay
          setTimeout(checkPlayersReady, 1000);
        }
      }, 500);
    }
  };

  // Calculate blend values based on droplet position
  const calculateBlends = () => {
    // Vertical position affects day/night blend (0 = full day, 100 = full night)
    const nightBlend = dropletPosition.y / 100;
    
    return { nightBlend };
  };

  // Get initial opacity values
  const getInitialOpacities = () => {
    const nightBlend = dropletPosition.y / 100;
    return {
      dayOpacity: 1 - nightBlend,
      nightOpacity: nightBlend
    };
  };

  // Update video volumes based on blend and fade
  const updateVideoVolumes = () => {
    if (!playersReady || !dayPlayerRef.current || !nightPlayerRef.current) return;

    try {
      const { nightBlend } = calculateBlends();
      const dayVolume = (1 - nightBlend) * 100 * audioFadeValue; // Apply fade multiplier
      const nightVolume = nightBlend * 100 * audioFadeValue;

      dayPlayerRef.current.setVolume(Math.round(dayVolume));
      nightPlayerRef.current.setVolume(Math.round(nightVolume));
    } catch (error) {
      console.error('Error setting video volumes:', error);
    }
  };

  // Start audio fade-in - synced with video fade (3 seconds)
  const startAudioFade = () => {
    if (audioFadeIntervalRef.current) {
      clearInterval(audioFadeIntervalRef.current);
    }

    // iOS specific: Unmute videos when starting audio fade
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isIOS && playersReady && dayPlayerRef.current && nightPlayerRef.current) {
      try {
        if (typeof dayPlayerRef.current.unMute === 'function') {
          dayPlayerRef.current.unMute();
          nightPlayerRef.current.unMute();
        }
      } catch (e) {
        console.log('iOS unmute attempt:', e);
      }
    }

    const fadeStep = 0.0167; // 1/60 to match 3-second video fade (60 steps)
    const fadeInterval = 50; // How often to update (ms)

    audioFadeIntervalRef.current = setInterval(() => {
      setAudioFadeValue(prev => {
        const newValue = prev + fadeStep;
        if (newValue >= 1) {
          if (audioFadeIntervalRef.current) {
            clearInterval(audioFadeIntervalRef.current);
            audioFadeIntervalRef.current = null;
          }
          return 1;
        }
        return newValue;
      });
    }, fadeInterval);
  };

  // Update video opacity and volumes based on vertical position
  useEffect(() => {
    const { nightBlend } = calculateBlends();
    
    if (dayIframeRef.current && nightIframeRef.current) {
      // Use transform3d for Safari performance
      dayIframeRef.current.style.opacity = `${1 - nightBlend}`;
      dayIframeRef.current.style.transform = 'translateZ(0)';
      dayIframeRef.current.style.willChange = 'opacity';
      
      nightIframeRef.current.style.opacity = `${nightBlend}`;
      nightIframeRef.current.style.transform = 'translateZ(0)';
      nightIframeRef.current.style.willChange = 'opacity';
    }

    // Update volumes
    updateVideoVolumes();
  }, [dropletPosition.y, playersReady, audioFadeValue]);

  // Update volumes when audio fade changes
  useEffect(() => {
    updateVideoVolumes();
  }, [audioFadeValue]);

  // Start the experience when user clicks
  const handleStart = async () => {
    setIsStarted(true);

    // Fade in videos and audio simultaneously after 1 second delay
    setTimeout(() => {
      setVideosFadedIn(true);
      startAudioFade(); // Start audio fade at the same time as video fade
    }, 1000);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioFadeIntervalRef.current) {
        clearInterval(audioFadeIntervalRef.current);
      }
    };
  }, []);

  // YouTube embed parameters - back to original without mute
  const getYouTubeEmbedUrl = (videoId: string) => {
    const isIOS = typeof window !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    const params = new URLSearchParams({
      autoplay: '1',
      controls: '0',
      disablekb: '1',
      loop: '1',
      playlist: videoId, // Required for loop to work
      modestbranding: '1',
      showinfo: '0',
      rel: '0',
      fs: '0',
      iv_load_policy: '3',
      enablejsapi: '1',
      playsinline: '1', // Enable inline playback on iOS
      start: '300', // Start at 5 minutes (300 seconds)
      origin: typeof window !== 'undefined' ? window.location.origin : ''
    });
    
    // Only add mute parameter for iOS to enable autoplay
    if (isIOS) {
      params.append('mute', '1');
    }
    
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  };

  const { dayOpacity, nightOpacity } = getInitialOpacities();

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Video layers */}
      {isStarted && (
        <div 
          className="absolute inset-0"
          style={{
            transition: 'opacity 3s ease-in-out',
            opacity: videosFadedIn ? 1 : 0
          }}
        >
          {/* Day video (bottom layer) */}
          <iframe
            ref={dayIframeRef}
            id="day-player"
            className="absolute inset-0 w-full h-full scale-125 origin-center"
            src={getYouTubeEmbedUrl('nZUMdnky11E')}
            allow="autoplay; fullscreen"
            style={{ 
              opacity: dayOpacity,
              pointerEvents: 'none',
              border: 'none'
            }}
          />
          
          {/* Night video (top layer) */}
          <iframe
            ref={nightIframeRef}
            id="night-player"
            className="absolute inset-0 w-full h-full scale-125 origin-center"
            src={getYouTubeEmbedUrl('_hEN8q2g9qQ')}
            allow="autoplay; fullscreen"
            style={{ 
              opacity: nightOpacity,
              pointerEvents: 'none',
              border: 'none'
            }}
          />
          
          {/* Overlay to hide any remaining YouTube UI */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Top gradient to hide title/controls if they appear */}
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/50 to-transparent" />
            {/* Bottom gradient to hide controls */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        </div>
      )}

      {/* Start overlay - just the centered droplet, no text */}
      {!isStarted && (
        <div 
          className="absolute inset-0 bg-black flex items-center justify-center cursor-pointer z-50"
          onClick={handleStart}
        >
          <svg
            viewBox="0 0 64 72"
            className="w-16 h-20 animate-pulse"
            style={{
              filter: 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.4))'
            }}
          >
            <defs>
              <linearGradient id="startGlassGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
              </linearGradient>
              
              <radialGradient id="startEdgeGlow" cx="50%" cy="40%">
                <stop offset="70%" stopColor="#ffffff" stopOpacity="0" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.15" />
              </radialGradient>
            </defs>
            
            <path
              d="M32 8c0 0-24 24-24 40c0 13.255 10.745 24 24 24s24-10.745 24-24c0-16-24-40-24-40z"
              fill="url(#startGlassGradient)"
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="0.5"
            />
            
            <path
              d="M32 8c0 0-24 24-24 40c0 13.255 10.745 24 24 24s24-10.745 24-24c0-16-24-40-24-40z"
              fill="url(#startEdgeGlow)"
              opacity="0.7"
            />
          </svg>
        </div>
      )}

      {/* Draggable droplet - only show after started */}
      {isStarted && (
        <DraggableDroplet
          position={dropletPosition}
          onPositionChange={setDropletPosition}
        />
      )}
    </div>
  );
} 