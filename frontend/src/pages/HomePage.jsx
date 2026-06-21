import { Link } from 'react-router-dom'
import { Camera, Film, Settings, Wand2 } from 'lucide-react'
import FallingParticles from '../components/FallingParticles'
import '../styles/HomePage.css'

function HomePage() {
  return (
    <div className="home-page">
      <FallingParticles count={25} />

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
        Made with ♡ — FRAMEVERSE <span className="by-yun">by Yun</span>
      </footer>
    </div>
  )
}

export default HomePage
