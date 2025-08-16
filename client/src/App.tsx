
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/navbar'
import Dashboard from './pages/Dashboard'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import Profile from './pages/Profile'
import { SidebarProvider } from './components/ui/sidebar'
import AppSideBar from './components/app-sidebar'
import Footer from './components/footer'

function App() {

  return (
    <SidebarProvider>
    <div className='w-full flex flex-col'>
      <AppSideBar />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Footer />
    </div>
    </SidebarProvider>
  )
}

export default App
