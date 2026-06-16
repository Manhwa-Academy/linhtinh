import { Link } from 'react-router-dom'
import { Camera, Film, Palette, Download, Cat } from 'lucide-react'
import '../styles/HomePage.css'

function HomePage() {
  return (
    <div className="home-page">
      <div className="decoration-cats">
        <span className="cat-icon"><Cat size={48} color="#D97706" fill="#FBBF24" /></span>
        <span className="cat-icon"><Cat size={48} color="#EA580C" fill="#FB923C" /></span>
        <span className="cat-icon"><Cat size={48} color="#B45309" fill="#FCD34D" /></span>
      </div>

      <div className="home-content">
        <h1 className="home-title">
          <span className="emoji"><Camera size={52} /></span>
          Meomiry Station
        </h1>
        
        <p className="home-description">
          Capture your sweetest moments with cute filters & photo strips
        </p>

        <Link to="/booth" className="start-button">
          <span className="button-icon"><Camera size={28} /></span>
          Start Photobooth
        </Link>

        <div className="features">
          <div className="feature-item">
            <span className="feature-icon"><Film size={40} color="#FF6B9D" /></span>
            <span>Photo Strips</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon"><Palette size={40} color="#4ECDC4" /></span>
            <span>Cute Filters</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon"><Download size={40} color="#4A90E2" /></span>
            <span>Instant Download</span>
          </div>
        </div>
      </div>

      <footer className="home-footer">
        Made with ♡ — Meomiry Station
      </footer>
    </div>
  )
}

export default HomePage
