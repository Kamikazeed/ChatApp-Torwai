import React, { useEffect, useRef, useState } from 'react'
import { assets } from '../assets/assets'
import { formatMessageTime } from '../library/utils';
import { useChatContext } from '../context/ChatContext';
import { useAuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const ChatContainer = () => {

  const {messages, selectedUser, setSelectedUser, sendMessage, getMessages} = useChatContext();
  const {authUser, onlineUsers} = useAuthContext();

  const scrollEnd = useRef();
  const [input, setInput] = useState('');

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return null;
    await sendMessage({text: input.trim()});
    setInput('')
  }

  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) {
      toast.error('select an image file');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({image: reader.result});
      e.target.value = ''
    }
    reader.readAsDataURL(file);
  }

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id)
    }
  }, [selectedUser])

  useEffect(() => {
    if(scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: 'smooth' })
    }
  },[messages])

  return selectedUser ? (
    <div className='h-full overflow-scroll relative backdrop-blur-lg'>
      {/* Header */}
      <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
        <img className='w-8 rounded-full' src={selectedUser.profilePic || assets.avatar_icon} />
        <p className='flex-1 text-lg text-white flex items-center gap-2'>
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) && 
          <span className='w-2 h-2 rounded-full bg-green-500'></span>
          }
        </p>

        <img className='w-6 h-6 md:hidden cursor-pointer' onClick={() => setSelectedUser(null)} src={assets.arrow_icon} />
        <img className='max-md:hidden w-5 h-5' src={assets.help_icon} />
      </div>

      {/* Chat area */}
      <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6 '>
        {messages.map((msg, index) => (
          <div className={`flex items-center gap-2 justify-end ${msg.senderId !== authUser._id && 'flex-row-reverse'} `} key={index}>
            {msg.image ? (
              <img className='max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8 ' src={msg.image} />
            ) : (
              <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${msg.senderId === authUser._id ? 'rounded-br-none' : 'rounded-bl-none'} `}>{msg.text}</p>
            )}
            <div className='text-center text-xs'>
              <img className='rounded-full w-7' src={msg.senderId === authUser._id ? authUser?.profilePic || assets.avatar_icon : selectedUser?.profilePic || assets.avatar_icon } />
              <p className='text-gray-500'>{formatMessageTime(msg.createdAt)}</p>
            </div>
          </div>
        ))}

        <div ref={scrollEnd}></div>
      </div>

      {/* Bottom area */}
      <div className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3'>
        <div className='flex-1 flex items-center bg-gray-100/12 px-3 rounded-full'>
          <input className='flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400' type="text" placeholder='Send a message' value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' ? handleSendMessage(e) : null} />
          <input type="file" id='image' accept='imge/png, image/jpeg' hidden onChange={handleSendImage} />
          <label htmlFor="image">
            <img className='w-5 mr-2 cursor-pointer' src={assets.gallery_icon} />
          </label>
        </div>
        <img className='w-7 cursor-pointer' src={assets.send_button} onClick={handleSendMessage} />
      </div>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
      <img className='max-w-16' src={assets.logo_icon} />
      <p className='text-lg font-medium text-white'>Chat anytime, anywhere</p>
    </div>
  )
}

export default ChatContainer
