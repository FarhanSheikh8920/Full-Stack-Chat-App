import { ImportIcon } from 'lucide-react'
import React, { useEffect } from 'react'
import Login from './page/Login.jsx'
import Home from './page/Home.jsx'
import Signup from  './page/Signup.jsx'
import Setting from './page/Setting.jsx'
import Profile from './page/Profile.jsx'
import {Toaster} from 'react-hot-toast'
import { Loader } from 'lucide-react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './Component/Navbar'
import { useAuthStore } from './store/useAuthStore.js'
import { useThemeStore } from './store/useThemestore.js'
const App = () => {
  const {authUser,checkAuth,isCheckingAuth,onlineUsers}=useAuthStore()
  const {theme}=useThemeStore();
  console.log(onlineUsers)
  useEffect(() => {
    checkAuth()
  },[checkAuth])

if(isCheckingAuth&&!authUser){
  return (
  <div className='flex justify-center items-center h-screen '>
    <Loader className='size-10 animate-spin'/>
  </div>
  
  
  )
}




  return (<>
 <div data-theme={theme}>
 <Navbar />
  <Routes>
        <Route path="/login" element={!authUser ?<Login />: <Navigate to="/" />}/>
        <Route path="/" element={authUser ?<Home /> : <Navigate to="/login" />}/>
        <Route path="/signup" element={!authUser ?<Signup />: <Navigate to="/" />}/>
        <Route path="/settings" element={<Setting /> }/>
        <Route path="/profile" element={ authUser?<Profile />:<Navigate to="/login" />}/>
  </Routes>
<Toaster />
</div>

  </>
  )
}

export default App