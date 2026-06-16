import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import BoothPage from './pages/BoothPage'
import './styles/App.css'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/booth" element={<BoothPage />} />
      </Routes>
    </div>
  )
}

export default App
