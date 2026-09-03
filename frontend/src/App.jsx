import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Advisor from './pages/Advisor.jsx'

export default function App() {
  return (
    <>
      <header className="site-header">
        <div className="site-header-inner">
          <Link to="/" className="brand">
            <span className="brand-mark" />
            GramVyapaar AI
          </Link>
          <span className="tagline">Right Advice. Right Scheme. Stronger Future.</span>
        </div>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/advisor" element={<Advisor />} />
        </Routes>
      </main>
      <footer>
        Built for SIH26091 — Ministry of Social Justice &amp; Empowerment · Team Lumicore
      </footer>
    </>
  )
}
