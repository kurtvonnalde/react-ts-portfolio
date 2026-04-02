import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import Header from './components/Header'
import Footer from './components/Footer'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header />
      <div>
        <h1 className="text-4xl font-bold text-center mt-8">Welcome to My Application</h1>
      </div>
      <Footer />
    </>
  )
}

export default App
