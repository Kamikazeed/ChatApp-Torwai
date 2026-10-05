import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import {ToastContainer} from 'react-toastify';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Login from './pages/Login';
import { useAuthContext } from './context/AuthContext';

const App = () => {
  
  const {authUser} = useAuthContext();

  return (
    <div className={`bg-[url('./src/assets/bgImage.svg')] bg-cover bg-no-repeat bg-center min-h-screen`}>
      <ToastContainer />
      <Routes >
        <Route path='/' element={authUser ? <Home /> : <Navigate to="/login" />} />
        <Route path='/login' element={!authUser ? <Login /> : <Navigate to="/" />} />
        <Route path='/profile' element={authUser ? <Profile /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  )
}

export default App
