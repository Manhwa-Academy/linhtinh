import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import BoothPage from './pages/BoothPage'
import AdminPage from './pages/AdminPage'
import './styles/App.css'

function App() {
  return (
    <div className="App">
      <div className="decoration-blossoms">
        {/* Bên trái */}
        <span className="blossom-icon" style={{left: '3%', animationDuration: '8s', animationDelay: '0s'}}>🌸</span>
        <span className="blossom-icon" style={{left: '10%', animationDuration: '11s', animationDelay: '2s'}}>🌸</span>
        <span className="blossom-icon" style={{left: '16%', animationDuration: '7s', animationDelay: '5s'}}>🌸</span>
        <span className="blossom-icon" style={{left: '7%', animationDuration: '12s', animationDelay: '1s'}}>🌸</span>
        <span className="blossom-icon" style={{left: '14%', animationDuration: '9s', animationDelay: '4s'}}>🌸</span>
        
        {/* Bên phải */}
        <span className="blossom-icon" style={{left: '84%', animationDuration: '10s', animationDelay: '3s'}}>🌸</span>
        <span className="blossom-icon" style={{left: '92%', animationDuration: '8s', animationDelay: '7s'}}>🌸</span>
        <span className="blossom-icon" style={{left: '97%', animationDuration: '11s', animationDelay: '1s'}}>🌸</span>
        <span className="blossom-icon" style={{left: '88%', animationDuration: '9s', animationDelay: '6s'}}>🌸</span>
        <span className="blossom-icon" style={{left: '94%', animationDuration: '13s', animationDelay: '2s'}}>🌸</span>
      </div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/booth" element={<BoothPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </div>
  )
}

export default App
