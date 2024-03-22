import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import React from 'react'
import { faMessage } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'
import { useClaimContext } from './Layout'
const InfoBox = ({user}) => {
  const router = useRouter();
  const claims = useClaimContext();
  const NavigateToChat = ()=>{
    const sortedIds = [parseInt(user.user_id), parseInt(claims.user_id)].sort((a, b) => a - b);
  
  
    const roomId = `${sortedIds[0]}${sortedIds[1]}`;
    router.push(`/chat/${roomId}?uid=${user.user_id}`)
  }
 
  return (
    <div className='bg-white p-3 rounded position-absolute top-0 start-0 infor-container'>
        <Image className='rounded-circle' src={'/avatar/no-avatar.jpg'} width={40} height={40} alt='avatar'/>
        <div className='d-inline-block mx-3'>
            <b>{user?.name}</b>
            {
              claims.user_id !=user?.user_id
              ?
              <button onClick={()=>NavigateToChat()} className='btn btn-large btn-success d-flex justify-content-center'>
                <FontAwesomeIcon icon={faMessage} style={{color:'white'}} />
            </button>:
              ""
            }
            
            
        </div>
    </div>
  )
}

export default InfoBox