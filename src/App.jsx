import './App.css'
import bg from "./assets/bg.png"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Topic from './Pages/Topic'  // ✅ make sure to import Topic component
import Result from './Pages/Result'

function App() {
  return (
    <Router>
      <div
        className='w-full h-screen flex justify-center items-center overflow-y-hidden'
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      >
        <Routes>
          <Route path='/' element={<Topic />} />

        </Routes>
      
      </div>
    </Router>
  )
}

export default App
