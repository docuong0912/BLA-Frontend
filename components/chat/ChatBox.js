import React, { useEffect } from 'react'
import { useState } from 'react';
import { useClaimContext } from '../Layout';
import ScrollToBottom from 'react-scroll-to-bottom';
import { useRouter } from 'next/router';
import Loader from '../Loader';
import ChatList from './ChatList';
import ConversationDataService from '../../data-service/ConversationDataService';
import SmallLoader from '../SmallLoader';

const ChatBox = ({ socket }) => {

    const router = useRouter();
    const claims = useClaimContext();
    const [message,setMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const [typing, isTyping] = useState(false);
    const [chats, setChats] = useState();
    const [chat, setChat] = useState();
    var typingTimeout = setTimeout(isTyping, 3000, false);
    const sendMessageToDB = async (data) => {
        
        await ConversationDataService.SendMessage(data);
    }
    useEffect(() => {

        socket.on('receive_message', data => {
            setMessageList(li => [...li, data]);
            isTyping(false)
            fetchAllChat();
            clearTimeout(typingTimeout);
        });
        socket.on('typing', () => {
            isTyping(true)
            
            clearTimeout(typingTimeout);
            typingTimeout = setTimeout(isTyping,3000,false)
        })
        socket.on('requestJoin', (room, userId) => {
            console.log(userId)
            if (userId == claims.user_id) {
                socket.emit('join_with', room);
                
            }
        })

    }, [socket]);
    const fetchAllChat = async () => {
        const res = await ConversationDataService.GetAllChat(claims.user_id);
        setChats(res)
    }
    useEffect(() => {
        
        const changeReadStatus = async () => {
            const res = await ConversationDataService.ChangeReadStatus(router.query.chatId, claims.user_id)
        }
        
        //const fetchChatDetail = async () => {
        //    const res = await ConversationDataService.GetChatDetails(router.query.chatId);
        //    setChat(chat);
        //    setMessageList(chat.chat_lines)
        //}
        const startNewConversation = async () => {
            const chatBody = {
                "chat_id": router.query.chatId,
                
                "room": [
                    {
                        "user_id": claims.user_id,
                        "isRead": true
                    },
                    {
                        "user_id": router.query.uid,
                        "isRead": false
                    }
                ]
            }
            const chat = await ConversationDataService.StartNewChat(chatBody);
            socket.emit('chatCreated', chatBody.chat_id,router.query.uid)
            setChat(chat);
            setMessageList([]);
        }
        if (!chats) {
            fetchAllChat();
        }
        else {
            //navigate to chat tab
            if (router.query.uid) {
                const existingChat = chats.find(c => c.room.some(r => r.user_id == router.query.uid))
                if (!chat || !messageList) {
                    if (existingChat) {
                        changeReadStatus();
                        setChat(existingChat)
                        setMessageList(existingChat.chat_lines)
                    }
                    else {
                        startNewConversation();
                    }
                }
                
            }
            
            
        }
    },[chats])
    
    const sendMessage =async ()=>{
        if(message!==""){
            const data = {
                chat_id: router.query.chatId,
                chat_text: message,
                create_at: new Date().toISOString().slice(0, 16),
                user_id: claims.user_id
            }
            sendMessageToDB(data)
            await socket.emit('send_message', data);
           setMessageList(li=>[...li,data])
            setMessage('')
            fetchAllChat();
        }
        
    }
    const handleChange = async (text) => {
        setMessage(text);
        await socket.emit('isTyping', router.query.chatId);
    }
    if (!messageList) return <Loader />
  return (
    
      <div className='d-flex justify-content-between chat-box-container'>
          <ChatList chats={chats}  />
        {chat
        ?
            <div className='chat-container flex-fill'>
            <div className='chat-header bg-white p-4'>
                      <b>Name</b>
                      
                          
                    
                      
            </div>
                  <ScrollToBottom className='chat-body bg-white border border-2 border-top'>
                    
                    {
                        messageList?.map(m=>{
                            return(
                                <div className={`d-flex ${m.user_id==claims.user_id? "justify-content-end":""}`}>
                                    <div className={`align-self-end  message-content ${m.user_id==claims.user_id?"bg-info me-4":"bg-light ms-3"} p-3 rounded `}> 
                                        <p>{m.chat_text}</p>
                                    </div>
                                    
                                </div>
                                
                            )
                        })
                      }
                      {typing ? <SmallLoader /> : ""}
            </ScrollToBottom>
        
                  <div className='chat-footer input-group'>
                      <input value={message} onKeyDown={e => { e.key === "Enter" && sendMessage() }} type='text' className='form-control' onChange={e => handleChange(e.target.value)} />
                <button onClick={sendMessage} className='btn btn-large btn-info'>Send</button>
            </div>
        </div>
        :
        <div className='chat-container d-flex flex-fill justify-content-center align-items-center'>
            <p>Select a chat</p>
        </div>
        }
    </div>
  )
}

export default ChatBox