import React, { useState } from 'react'
import assets from '../assets/assets'
import { useAuthContext } from '../context/AuthContext';

const Login = () => {

  const [currentState, setCurrentState] = useState('Sign Up');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const {login} = useAuthContext();

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (currentState === 'Sign Up' && !isDataSubmitted) {
      setIsDataSubmitted(true)
      return;
    }

    login(currentState === 'Sign Up' ? 'signup' : 'login', {fullName, email, password, bio})
  }

  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
      {/* Left */}
      <img className='w-[min(30vw, 250px)] ' src={assets.logo_big} />

      {/* Right */}
      <form className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg' onSubmit={onSubmitHandler}>
        <h2 className='font-medium text-2xl flex justify-between items-center'>
          {currentState}
          {isDataSubmitted && 
            <img className='w-5 cursor-pointer' onClick={() => setIsDataSubmitted(false)} src={assets.arrow_icon} />
          }
        </h2>

        {currentState === 'Sign Up' && !isDataSubmitted && (
          <input className='p-2 border border-gray-500 rounded-md focus:outline-none' type="text" placeholder='Full Name' required value={fullName} onChange={(e) => setFullName(e.target.value)} />
        )}

        {!isDataSubmitted && (
          <>
            <input className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' 
            type="email" placeholder='Email Address' required 
            value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' 
            type="password" placeholder='Password' required 
            value={password} onChange={(e) => setPassword(e.target.value)} />
          </>
        )}
        
        {currentState === 'Sign Up' && isDataSubmitted && (
          <textarea className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' rows={4} placeholder='Provide a short bio...' value={bio} onChange={(e) => setBio(e.target.value)}></textarea>
        )}

        <button className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer' type='submit'>
          {currentState === 'Sign Up' ? 'Create Account' : 'Login Now'}
        </button>

        <div className='flex items-center gap-2 text-sm text-gray-500'>
          <input className='cursor-pointer' type="checkbox" />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>

        <div className='flex flex-sol gap-2'>
          {currentState === 'Sign Up' ? (
            <p className='text-sm text-gray-600'>
              Already have an account? 
              <span className='font-medium text-violet-500 cursor-pointer' onClick={() => {setCurrentState('Login'); setIsDataSubmitted(false)}}> Login here</span>
            </p>
          ) : (
            <p className='text-sm text-gray-600'>
              Create an account 
              <span className='font-medium text-violet-500 cursor-pointer' onClick={() => setCurrentState('Sign Up')}> Click here</span>
            </p>
          )}
        </div>
      </form>
    </div>
  )
}

export default Login
