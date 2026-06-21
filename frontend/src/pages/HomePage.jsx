import { Link } from 'react-router-dom'
import { Camera, Film, Settings, Wand2, Globe } from 'lucide-react'
import FallingParticles from '../components/FallingParticles'
import { useTranslation } from '../i18n/useTranslation'
import '../styles/HomePage.css'

function HomePage() {
  const { t, language, toggleLanguage } = useTranslation()
  return (
    <div className="home-page">
      <FallingParticles count={25} />

      {/* Language Toggle Button */}
      <button 
        onClick={toggleLanguage}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'rgba(255, 255, 255, 0.9)',
          border: 'none',
          borderRadius: '8px',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '600',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          zIndex: 1000
        }}
      >
        <Globe size={18} />
        {language === 'vi' ? 'English' : 'Tiếng Việt'}
      </button>

      <div className="home-content">
        <div className="logo-badge">Photo Booth ✨</div>
        
        <h1 className="home-title">
          {t.home.title}
        </h1>
        
        <p className="home-description">
          {t.home.subtitle}
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
          {t.home.startButton}
        </Link>

        <br />
        <Link to="/admin" className="admin-link">
          <Settings size={16} /> {t.home.adminButton}
        </Link>
       
      </div>

      <footer className="home-footer">
        Made with ♡ — FRAMEVERSE <span className="by-yun">by Yun</span>
      </footer>
    </div>
  )
}

export default HomePage
