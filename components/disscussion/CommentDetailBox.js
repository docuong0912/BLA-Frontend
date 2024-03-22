import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
const CommentDetailBox = ({openComment,setOpen,post,users,sendComment,key}) => {
    const [comment,setComment] = useState('');
    const [commentList, setCommentList] = useState(post?.comment);
    useEffect(() => {
        setCommentList(post?.comment)
    },[post])
  return (
    <div className={`position-fixed w-100 h-100 bg-dark bg-opacity-50 top-0 start-0 comment-box-container ${openComment?"":"d-none"}`}>
            <div className='position-absolute bg-white rounded-3 top-50 start-50 comment-box p-2'>
                <FontAwesomeIcon onClick={()=>setOpen(false)} className='position-absolute top-0 end-0 m-3' icon={faX}/>
                <div className='p-3 d-flex align-items-center justify-content-start '>
                    <Image src={"/avatar/no-avatar.jpg"} width={40} height={40} className='rounded-circle' alt='avatar'/>
                    <div className='mx-2'>
                        <b className='fs-4'>{post?.post_title}</b>
                        <p className='text-secondary'>{users?.find(u=>u.user_id == post?.create_by.slice(-1))?.name}</p>
                        
                    </div>
                    <p className='text-secondary align-self-start my-2 '>{post?.post_created.slice(11,16)}</p>
                    <p className='text-secondary align-self-start my-2 mx-2 '>{post?.post_created.slice(0,10)}</p>
                </div>
                <p className='mx-3'>{post?.post_content}</p>
                <hr/>
              <div className='comment-section'>
                  {commentList?.map(c => {
                        return(
                            <div className='mx-5 d-flex justify-content-start '>
                                        
                                <Image src={"/avatar/no-avatar.jpg"} width={30} height={30} className=' rounded-circle' alt='avatar'/>
                                <div className=' mx-2'>
                                    <b>{users?.find(u=>u.user_id == c.user.slice(-1))?.name}</b>
                                    <p>{c.comment_content}</p>
                                    
                                </div>
                                <div>
                                    <p className='text-secondary'>{c.create_at.slice(0,10)}</p>
                                </div>
                            </div>
                        );
                    })}
                    <div className='input-group comment'>
                        <textarea value={comment} onChange={e=>setComment(e.target.value)} className='form-control'/>
                        <button onClick={()=>sendComment(post.post_id,comment,setComment,key)} className='btn btn-info'>Send</button>
                    </div>
                    
                </div>
                
            </div>
    </div>
  )
}

export default CommentDetailBox