// App.tsx
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './app/home/Home'
import About from './app/about/About'
import Contact from './app/contact/Contact'
import BoardPage from './app/project/BoardPage'

function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/projects" element={<BoardPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App