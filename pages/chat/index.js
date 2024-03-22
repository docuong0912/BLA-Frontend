import Layout from '@/components/Layout';
import ChatBox from '@/components/chat/ChatBox';
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); // Replace with your server URL

const Index = () => {

  return (
    <div>
      <ChatBox socket={socket} haveChat={false}/>
    </div>
  );
};

export default Index;
Index.getLayout = page=>{
  return(
    <Layout>
      {page}
    </Layout>
  )
}