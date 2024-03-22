import React from 'react'
import { useEffect,useState } from 'react';
import { NavigateToChat } from '../utils/ChatNavigation';
import { useClaimContext } from '../Layout';
import Image from 'next/image';
import Loader from '../Loader';
import { useRouter } from 'next/router';
import UserDataService from '../../data-service/UserDataService';
const ChatList = ({chats}) => {
    const router = useRouter();
    const claims = useClaimContext();
    const [userList,setUserList] = useState([]);
    const [conversationList,setConversationList] = useState([]);
    const [roomList,setRoomList] = useState([])
    useEffect(() => {
        if (chats)
        
            GetChatList();
    }, [chats]);

    const GetChatList = async () => {
        // map through all room in chats of current user and filter out user_id
        // that is not current user_id and map only user_id
        const matching_user_ids = chats?.map(c => c.room.find(r => r.user_id != claims.user_id));
        
        let conversations = chats?.map(c => c.chat_lines[c.chat_lines.length-1]);
        setRoomList(matching_user_ids);
        setConversationList(conversations)
        if (userList.length < chats.length)
        matching_user_ids.forEach(async (u,k) => {
            const user = claims.role_name == "Lecturer" ? await UserDataService.getStudentInfo(u.user_id) : await UserDataService.getLecturerInfo(u.user_id);
            setUserList(tempList => [...tempList,user])
        })
    }
  return (
    <div className='d-flex flex-column contact-list col-4 p-4'>
           
            {
                userList?.map((u,k)=>{
                    return (
                        <div className=''>
                            <button onClick={()=>NavigateToChat(u,claims,router)} className='btn btn-large p-4 flex-fill chat-btn d-flex my-2'>
                                <Image src={'/avatar/no-avatar.jpg'} width={60} height={60} className='rounded-circle' alt='avatar'/>
                                <div>
                                    <b className='mx-4 fs-4'>{u?.name}</b>
                                    <p className={`text-secondary text-start mx-4 ${!roomList[k]?.isRead ? 'fw-bold text-black' : ""}`}>
                                        {claims.user_id == conversationList[k]?.user_id ? "You: " : ""}{conversationList[k]?.chat_text.length > 25 ? conversationList[k]?.chat_text.slice(0, 25) + '...' : conversationList[k]?.chat_text}
                                    </p>
                                </div>
                                
                            </button>
                            
                        </div>
                    )
                })
            }
        </div>
  )
}

export default ChatList