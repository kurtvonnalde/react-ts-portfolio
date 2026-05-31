// App.tsx
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './app/home/Home'
import About from './app/about/About'
import Sources from './app/sources/Sources'
import CV from './app/cv/CV'

function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/cv" element={<CV />} />
          <Route path="/sources" element={<Sources />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App