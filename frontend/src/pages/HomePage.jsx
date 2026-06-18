import { Link } from 'react-router-dom'
import { Camera, Film, Palette, Download, Settings, Sparkles, Image, Wand2 } from 'lucide-react'
import '../styles/HomePage.css'

function HomePage() {
  return (
    <div className="home-page">
      <div className="home-content">
        <div className="logo-badge">✨ Retro-Style Photo Booth</div>
        
        <h1 className="home-title">
          STARLACE
        </h1>
        
        <p className="home-description">
          Capture your moment, frame your memory forever
        </p>

        {/* Photo Strip Preview */}
        <div className="strip-preview">
          <div className="strip-slot"></div>
          <div className="strip-slot"></div>
          <div className="strip-slot"></div>
          <div className="strip-slot"></div>
          <div className="strip-label">Frame idea × 4-pic</div>
        </div>

        <Link to="/booth" className="start-button">
          <Camera size={24} />
          Start Shooting
        </Link>

        {/* Features */}
        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-icon">
              <Camera size={28} />
            </div>
            <div className="feature-label">Auto Capture</div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <Film size={28} />
            </div>
            <div className="feature-label">4-Pic Frames</div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <Wand2 size={28} />
            </div>
            <div className="feature-label">QR Export</div>
          </div>
        </div>

        <Link to="/admin" className="admin-link">
          <Settings size={16} /> Gallery
        </Link>
       
      </div>

      <footer className="home-footer">
        Made with ♡ — Meomiry Station
      </footer>
    </div>
  )
}

export default HomePage
