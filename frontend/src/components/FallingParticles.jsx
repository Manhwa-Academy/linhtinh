import { useState, useEffect } from 'react'

const ParticleIcon = ({ type, color, size = 48 }) => {
  switch (type) {
    case 'sparkle':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" 
                fill={color} stroke="white" strokeWidth="1" 
                style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.8))' }} />
        </svg>
      )
    case 'star':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" 
                fill={color} stroke="white" strokeWidth="1"
                style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.8))' }} />
        </svg>
      )
    case 'flower':
      return <span style={{ fontSize: `${size}px`, filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.6))' }}>🌸</span>
    case 'trophy':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M7 4V8C7 10.2 8.8 12 11 12H13C15.2 12 17 10.2 17 8V4H7Z" 
                fill={color} stroke="white" strokeWidth="1.5" 
                style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.6))' }} />
          <path d="M12 12V16M10 16H14M9 20H15" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <rect x="9" y="19" width="6" height="2" rx="1" fill={color} 
                style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.6))' }} />
          <path d="M7 4H5C4 4 3 5 3 6V7C3 8.5 4 9.5 5.5 9.5H7" stroke={color} strokeWidth="1.5" />
          <path d="M17 4H19C20 4 21 5 21 6V7C21 8.5 20 9.5 18.5 9.5H17" stroke={color} strokeWidth="1.5" />
        </svg>
      )
    case 'heart':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M12 21C12 21 3 15 3 9C3 6 5 4 7.5 4C9.5 4 11 5 12 6.5C13 5 14.5 4 16.5 4C19 4 21 6 21 9C21 15 12 21 12 21Z" 
                fill={color} stroke="white" strokeWidth="1.5"
                style={{ filter: 'drop-shadow(0 0 6px rgba(255,107,157,0.6))' }} />
        </svg>
      )
    default:
      return null
  }
}

function FallingParticles({ count = 20 }) {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    const generateParticles = () => {
      // Tăng tỷ lệ cup, star, heart so với sparkle
      const icons = [
        { type: 'flower', color: '#FF6B9D', size: 48 },
        { type: 'flower', color: '#FFC0CB', size: 48 },
        { type: 'trophy', color: '#FFD700', size: 48 },  // Cup màu vàng
        { type: 'trophy', color: '#F59E0B', size: 48 },  // Cup màu cam
        { type: 'star', color: '#FBBF24', size: 48 },    // Ngôi sao vàng
        { type: 'star', color: '#FCD34D', size: 48 },    // Ngôi sao vàng nhạt
        { type: 'heart', color: '#FF6B9D', size: 48 },   // Trái tim hồng
        { type: 'heart', color: '#FF1493', size: 48 },   // Trái tim đậm
        { type: 'sparkle', color: '#FCD34D', size: 40 }  // Sparkle nhỏ hơn
      ]
      const newParticles = []
      
      for (let i = 0; i < count; i++) {
        const icon = icons[Math.floor(Math.random() * icons.length)]
        newParticles.push({
          id: i,
          type: icon.type,
          color: icon.color,
          size: icon.size,
          left: Math.random() * 100,
          animationDuration: 20 + Math.random() * 10,  // 20-30s để rơi rất chậm, dễ nhìn hơn
          animationDelay: Math.random() * 20,          // Random delay để liên tục
          rotate: Math.random() * 360                  // Random rotation
        })
      }
      
      setParticles(newParticles)
    }

    generateParticles()
    
    // Regenerate particles để tạo hiệu ứng liên tục
    const interval = setInterval(() => {
      generateParticles()
    }, 20000) // Mỗi 20s regenerate để luôn có particles mới
    
    return () => clearInterval(interval)
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
            animationDelay: `${particle.animationDelay}s`,
            transform: `rotate(${particle.rotate}deg)`
          }}
        >
          <ParticleIcon type={particle.type} color={particle.color} size={particle.size} />
        </div>
      ))}
    </div>
  )
}

export default FallingParticles
