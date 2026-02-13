import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AdminRegister from "./pages/AdminRegister";
import AdminLogin from "./pages/AdminLogin";

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <h1>Alertify</h1>
      <nav>
        <Link to="/adminregister">
          <button>Register</button>
        </Link>

        <Link to="/adminlogin">
          <button>Login</button>
        </Link>
      </nav>
      <Routes>
        <Route path="/adminregister" element={<AdminRegister />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
      </Routes>
    </Router>
  );
}

export default App
