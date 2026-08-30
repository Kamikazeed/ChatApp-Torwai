import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';
import {toast} from 'react-toastify';
import {io} from 'socket.io-client';
import {useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {

  const navigate = useNavigate();

  const [token, setToken] = useState(localStorage.getItem('token'));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  const checkAuth = async () => {
    try {
      const {data} = await axios.get('/api/auth/check')
      if(data.success) {
        setAuthUser(data.user)
        connectSocket(data.user)
      }
      
    } catch (err) {
      toast.error(`❌ เกิดข้อผิดพลาด : ${err.message}`);
    }
  }

  const login = async (state, credentials) => {
    try {
      const {data} = await axios.post(`/api/auth/${state}`, credentials);
      if(data.success) {
        setAuthUser(data.userData);
        connectSocket(data.userdata);

        axios.defaults.headers.common['token'] = data.token;
        setToken(data.token)
        localStorage.setItem('token', data.token)

        toast.success(`${data.message}`);
      } else {
        toast.error(`❌ เกิดข้อผิดพลาด : ${data.message}`);
      }
      
    } catch (err) {
      toast.error(`❌ เกิดข้อผิดพลาด : ${err.message}`);
    }
  }

  const logout = async () => {
    localStorage.removeItem('token');
    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);
    axios.defaults.headers.common['token'] = null;
    socket.disconnect();

    toast.success('Logged out successfully')
  }

  const updateProfile = async (body) => {
    try {
      const {data} = await axios.put('/api/auth/update-profile', body);
      if (data.success) {
        setAuthUser(data.user);
        toast.success('Profile updated successfully')
      }
      
    } catch (err) {
      toast.error(`❌ เกิดข้อผิดพลาด : ${err.message}`);
    }
  }
  
  const connectSocket = (userData) => {
    if (!userData || socket?.connected) return;
    const newSocket = io(backendUrl, {
      query: {
        userId: userData._id,
      }
    });
    newSocket.connect();
    setSocket(newSocket);

    newSocket.on('getOnlineUsers', (userIds) => {
      setOnlineUsers(userIds);
    })
  }

  useEffect(() => {
    if(token) {
      axios.defaults.headers.common['token'] = token;
    }
    checkAuth()
  },[])

  const value = {
    navigate,
    axios,
    authUser,
    onlineUsers,
    socket,
    login,
    logout,
    updateProfile 
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  return useContext(AuthContext);
}

