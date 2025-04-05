import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute'
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import DashboardPage from './pages/DashboardPage';
import PresentationPage from './pages/PresentationPage';
import NavigationBar from './components/NavigationBar';
import { checkAuth } from './utils/helper';
import { useEffect, useState } from 'react';

function App() {
  const [loginStatus, setLoginStatus] = useState(false)

  useEffect(() => {
    setLoginStatus(checkAuth)
  }, [])

  return (
    <>
      <BrowserRouter>
        {loginStatus && (
          <NavigationBar setLoginStatus={setLoginStatus}></NavigationBar>
        )}

        <Routes>
          <Route path="/" element={<LandingPage/>} />
          <Route path="/login" element={<LoginPage setLoginStatus={setLoginStatus}/>} />
          <Route path="/register" element={<RegistrationPage setLoginStatus={setLoginStatus}/>} />
          <Route path="/dashboard" element={<ProtectedRoute route={<DashboardPage />}></ProtectedRoute>} />
          <Route path="/presentation/:id" element={<ProtectedRoute route={<PresentationPage />}></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
