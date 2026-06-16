import { Link } from 'react-router-dom'
import '../styles/HomePage.css'

function HomePage() {
  return (
    <div className="home-page">
      <div className="decoration-cats">
        <span className="cat-icon">🐱</span>
        <span className="cat-icon">😺</span>
        <span className="cat-icon">😸</span>
      </div>

      <div className="home-content">
        <h1 className="home-title">
          <span className="emoji">📸</span>
          Meomiry Station
        </h1>
        
        <p className="home-description">
          Capture your sweetest moments with cute filters & photo strips
        </p>

        <Link to="/booth" className="start-button">
          <span className="button-icon">📷</span>
          Start Photobooth
        </Link>

        <div className="features">
          <div className="feature-item">
            <span className="feature-icon">📷</span>
            <span>Photo Strips</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🎨</span>
            <span>Cute Filters</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">⬇️</span>
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
