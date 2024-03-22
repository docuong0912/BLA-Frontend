import React, { useEffect,useState } from 'react'
import { useRouter } from 'next/router'
import io from 'socket.io-client';
import ChatBox from '@/components/chat/ChatBox';
import Layout, { useClaimContext } from '@/components/Layout';

const ChatRoom = () => {
    const router = useRouter();
    const room = router.query.chatId;
    const chatsocket = io('http://localhost:3001/chat'); // Replace with your server URL

    useEffect(()=>{
        chatsocket.emit('join_with',room)
       
    },[])
  return (
    <ChatBox socket={chatsocket} />
  )
}

export default ChatRoom
ChatRoom.getLayout = page=>{
    return(
      <Layout>
        {page}
      </Layout>
    )
  }