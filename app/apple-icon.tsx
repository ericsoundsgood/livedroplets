import { ImageResponse } from 'next/og'

// Image metadata
export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

// Image generation
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
        }}
      >
        <svg
          width="120"
          height="140"
          viewBox="0 0 64 72"
          style={{ filter: 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.4))' }}
        >
          <defs>
            <linearGradient id="appleIconGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
            </linearGradient>
            
            <radialGradient id="appleEdgeGlow" cx="50%" cy="40%">
              <stop offset="70%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.2" />
            </radialGradient>
          </defs>
          
          <path
            d="M32 8c0 0-24 24-24 40c0 13.255 10.745 24 24 24s24-10.745 24-24c0-16-24-40-24-40z"
            fill="url(#appleIconGradient)"
            stroke="rgba(255, 255, 255, 0.3)"
            strokeWidth="0.5"
            opacity="0.95"
          />
          
          <path
            d="M32 8c0 0-24 24-24 40c0 13.255 10.745 24 24 24s24-10.745 24-24c0-16-24-40-24-40z"
            fill="url(#appleEdgeGlow)"
            opacity="0.7"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
} 