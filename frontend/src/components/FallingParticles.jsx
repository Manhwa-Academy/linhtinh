import { useState, useEffect } from 'react'

const ParticleIcon = ({ type, color }) => {
  switch (type) {
    case 'sparkle':
      return (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" 
                fill={color} stroke="white" strokeWidth="1" 
                style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.8))' }} />
        </svg>
      )
    case 'star':
      return (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" 
                fill={color} stroke="white" strokeWidth="1"
                style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.8))' }} />
        </svg>
      )
    case 'flower':
      return <span style={{ fontSize: '48px', filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.6))' }}>🌸</span>
    case 'trophy':
      return (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path d="M7 4V8C7 10.2 8.8 12 11 12H13C15.2 12 17 10.2 17 8V4H7Z" 
                fill={color} stroke="white" strokeWidth="1" />
          <path d="M12 12V16M10 16H14M9 20H15" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <rect x="9" y="19" width="6" height="2" rx="1" fill={color} />
        </svg>
      )
    case 'heart':
      return (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path d="M12 21C12 21 3 15 3 9C3 6 5 4 7.5 4C9.5 4 11 5 12 6.5C13 5 14.5 4 16.5 4C19 4 21 6 21 9C21 15 12 21 12 21Z" 
                fill={color} stroke="white" strokeWidth="1"
                style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.6))' }} />
        </svg>
      )
    default:
      return null
  }
}

function FallingParticles({ count = 15 }) {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    const generateParticles = () => {
      const icons = [
        { type: 'sparkle', color: '#FCD34D' },
        { type: 'star', color: '#FBBF24' },
        { type: 'flower', color: '#FF6B9D' },
        { type: 'trophy', color: '#F59E0B' },
        { type: 'heart', color: '#FF6B9D' },
        { type: 'sparkle', color: '#FCD34D' },
        { type: 'star', color: '#FBBF24' },
        { type: 'flower', color: '#FFC0CB' },
        { type: 'trophy', color: '#FFD700' }
      ]
      const newParticles = []
      
      for (let i = 0; i < count; i++) {
        const icon = icons[Math.floor(Math.random() * icons.length)]
        newParticles.push({
          id: i,
          type: icon.type,
          color: icon.color,
          left: Math.random() * 100,
          animationDuration: 8 + Math.random() * 4,
          animationDelay: Math.random() * 10
        })
      }
      
      setParticles(newParticles)
    }

    generateParticles()
  }, [count])

  return (
    <div className="particles-container">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.left}%`,
            animationDuration: `${particle.animationDuration}s`,
            animationDelay: `${particle.animationDelay}s`
          }}
        >
          <ParticleIcon type={particle.type} color={particle.color} />
        </div>
      ))}
    </div>
  )
}

export default FallingParticles
