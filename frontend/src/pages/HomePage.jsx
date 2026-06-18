import { Link } from 'react-router-dom'
import { Camera, Film, Settings, Wand2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import '../styles/HomePage.css'

function HomePage() {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    // Generate random particles
    const generateParticles = () => {
      const icons = ['✨', '⭐', '🌸', '✨', '⭐', '🌸', '🏆']
      const newParticles = []
      
      for (let i = 0; i < 15; i++) {
        newParticles.push({
          id: i,
          icon: icons[Math.floor(Math.random() * icons.length)],
          left: Math.random() * 100,
          animationDuration: 5 + Math.random() * 5,
          animationDelay: Math.random() * 5,
          size: 0.8 + Math.random() * 0.7
        })
      }
      
      setParticles(newParticles)
    }

    generateParticles()
  }, [])

  return (
    <div className="home-page">
      {/* Falling particles */}
      <div className="particles-container">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.left}%`,
              animationDuration: `${particle.animationDuration}s`,
              animationDelay: `${particle.animationDelay}s`,
              fontSize: `${particle.size}rem`
            }}
          >
            {particle.icon}
          </div>
        ))}
      </div>

      <div className="home-content">
        <div className="logo-badge">Photo Booth ✨</div>
        
        <h1 className="home-title">
          FRAMEVERSE 
        </h1>
        
        <p className="home-description">
          Capture Today, Remember Forever
        </p>

        {/* Photo Strip Preview with glow */}
        <div className="strip-preview glowing">
          <div className="strip-slot"></div>
          <div className="strip-slot"></div>
          <div className="strip-slot"></div>
          <div className="strip-slot"></div>
          <div className="strip-label">FRAMEVERSE</div>
        </div>

        <Link to="/booth" className="start-button">
          <Camera size={24} />
          Start
        </Link>

        <br />
        <Link to="/admin" className="admin-link">
          <Settings size={16} /> Gallery
        </Link>
       
      </div>

      <footer className="home-footer">
        Made with ♡ — FRAMEVERSE
      </footer>
    </div>
  )
}

export default HomePage
