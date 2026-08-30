import { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "./AuthContext";
import { toast } from "react-toastify";

export const ChatContext = createContext();

export const ChatProvider = ({children}) => {

  const {socket, axios} = useAuthContext();

  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  const getUsers = async () => {
    try {
      const {data} = await axios.get('/api/messages/users');
      if(data.success) {
        setUsers(data.users)
        setUnseenMessages(data.unseenMessages)
      }
      
    } catch (err) {
      toast.error('❌ เกิดข้อผิดพลาด', err.message);
    }
  }

  const getMessages = async (userId) => {
    try {
      const {data} = await axios.get(`/api/messages/${userId}`)
      if(data.success) {
        setMessages(data.messages)
      }
      
    } catch (err) {
      toast.error('❌ เกิดข้อผิดพลาด', err.message);
    }
  }

  const sendMessage = async (messageData) => {
    try {
      const {data} = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
      if(data.success) {
        setMessages((prevMessages) => [...prevMessages, data.newMessage])
      } else {
        toast.error('❌ เกิดข้อผิดพลาด', data.message);
      }
      
    } catch (err) {
      toast.error('❌ เกิดข้อผิดพลาด', err.message);
    }
  }

  const subscribeToMessages = async () => {
    if (!socket) return;
    
    socket.on('newMessage', (newMessage) => {
      if(selectedUser && newMessage.senderId === selectedUser._id) {
        newMessage.seen = true;
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        axios.put(`/api/messages/mark/${newMessage._id}`);
      } else {
        setUnseenMessages((prevUnseenMessages) => ({
          ...prevUnseenMessages, [newMessage.senderId] : prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId] + 1 : 1
        }))
      }
    })
  }

  const unsubscribeFromMessages = () => {
    if(socket) socket.off('newMessage');
  }

  // ตรงนี้ๆ
  useEffect(() => {
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [socket, selectedUser])

  const value = {
    messages,
    users,
    selectedUser, setSelectedUser,
    unseenMessages, setUnseenMessages,
    getUsers,
    getMessages,
    sendMessage,
  }

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  )
}

export const useChatContext = () => {
  return useContext(ChatContext);
}