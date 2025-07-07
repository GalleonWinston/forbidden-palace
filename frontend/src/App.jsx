import React, { use, useEffect } from 'react'





import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';


import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';


import { Toaster } from 'react-hot-toast';

const App = () => {
  const { authUser, checkAuth, isChecktingAuth} = useAuthStore();


  useEffect(() => {
    checkAuth();
  },[checkAuth])

  console.log("Auth User:", authUser);

  if (isChecktingAuth && !authUser) {
    return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin" />
    </div>
    )
  }

  return (
    <div>

      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
      </Routes>

      <Toaster />


    </div>
  )
}

export default App