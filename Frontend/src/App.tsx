
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Register from './feature/register/Register'
import Login from './feature/login/Login'
import Navbar from './shared/Navbar'
import { useSelector } from 'react-redux'
import type { RootState } from './store/TaskAppStore'
import TaskDashboard from './feature/dashboard/TaskDashboard'

function App() {
  const { token } = useSelector((state: RootState) => state.AppAuth);

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={token ? <TaskDashboard /> : <Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
