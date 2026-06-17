import { Link } from 'react-router-dom'
import { Camera, Film, Palette, Download, Settings } from 'lucide-react'
import '../styles/HomePage.css'

function HomePage() {
  return (
    <div className="home-page">
      <div className="home-content">
        <h1 className="home-title">
          <span className="emoji"><Camera size={52} /></span>
         STARLACE
        </h1>
        
        <p className="home-description">
          Capture your sweetest moments
        </p>

        <Link to="/booth" className="start-button">
          <span className="button-icon"><Camera size={28} /></span>
          Start
        </Link>

        <Link to="/admin" className="admin-link">
          <Settings size={18} /> Admin Panel
        </Link>
       
      </div>

      <footer className="home-footer">
        Made with ♡ — Meomiry Station
      </footer>
    </div>
  )
}

export default HomePage
