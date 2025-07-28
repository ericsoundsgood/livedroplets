import { ImageResponse } from 'next/og'

// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

// Image generation
export default function Icon() {
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
          width="24"
          height="28"
          viewBox="0 0 64 72"
          style={{ filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.4))' }}
        >
          <defs>
            <linearGradient id="iconGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          
          <path
            d="M32 8c0 0-24 24-24 40c0 13.255 10.745 24 24 24s24-10.745 24-24c0-16-24-40-24-40z"
            fill="url(#iconGradient)"
            stroke="rgba(255, 255, 255, 0.4)"
            strokeWidth="1"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
} 