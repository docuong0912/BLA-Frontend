import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import useFetch from '@/hooks/useFetch'
import { useClaimContext } from '../Layout';
import { fetchUserList } from './utils';
import CommentDetailBox from './CommentDetailBox';
import Loader from '../Loader';
const Post = ({ disscussion }) => {
    const claims = useClaimContext();
    const [users,setUser] = useState();
    const [comment,setComment] = useState([]);
    const [openComment,setOpen] = useState(false);
    const [post,setPost] = useState();
    const handleOpenCommentBox = (post)=>{
        setOpen(true);
        setPost(post);
    }
    const sendComment=async(pid,comment,setComment,key=null)=>{
       
        if(comment[key]=='') return;
        
        const res = await fetch(`https://localhost:7053/api/Posts/add-comment/${pid}`,{
            method:'PUT',
            body:JSON.stringify({
                "post_id":pid,
                "comment":[{
                    "comment_content":comment[key],
                    "user":claims.role_name=="Lecturer"?`Lecturers/${claims.user_id}`:`Students/${claims.user_id}`
                }]
            }),
            headers:{
                "Content-Type":'application/json'
            }
        })
        setComment(c=>{return{...c,[key]:''}});
    }
    
useEffect(()=>{
    const fetchData = async () => {
        const userData = await fetchUserList(disscussion);
        setUser(userData);
    };

    fetchData();
}, [disscussion])

  return (
    <div className=''>
        <CommentDetailBox sendComment={sendComment} openComment={openComment} setOpen={setOpen} post={post} users={users}/>
       
        {
            disscussion?.posts?.map((p,k)=>{
                return(
                    <div className='bg-white p-3 rounded-3 my-5 col-5 mx-auto'>
                        <div className=' d-flex justify-content-between'>
                            <div className='flex-fill'>
                                <b className='fs-3'>{p.post_title}</b>
                                <p>{p.post_content}</p>
                                
                            </div>
                            <Image src={"/avatar/no-avatar.jpg"} width={50} height={50} className='rounded-circle' alt='avatar'/>
                            <div className='mx-2'>
                                <b>{users?.find(u=>u.user_id == p.create_by.slice(-1)).name}</b>
                                <p>{p.post_created.slice(0,10)}</p>
                            </div>
                            
                        </div>
                        
                        <hr/>
                        <p onClick={()=>handleOpenCommentBox(p)} className={`${p.comment?.length>3?"":"d-none"} mx-5 text-info`}>View more commments</p>
                        {p.comment?.slice(-3).map(m=>{
                            return(
                                <div className='mx-5 d-flex justify-content-start'>
                                    
                                    <Image src={"/avatar/no-avatar.jpg"} width={40} height={40} className=' rounded-circle' alt='avatar'/>
                                    <div className=' mx-2'>
                                        <b>{users?.find(u=>u.user_id == m.user.slice(-1))?.name}</b>
                                        <p>{m.comment_content}</p>
                                </div>
                            </div>
                            );
                        })}
                        
                        <div className='input-group d-flex align-items-center'>
                            <textarea value={comment[k]} onChange={e=>setComment(c=>{return {...c,[k]:e.target.value}})} className='form-control' type='text'/>
                            <button onClick={()=>sendComment(p.post_id,comment,setComment,k)} className='btn btn-lg btn-info '>Comment</button>
                        </div>
                    </div>
                );
            })
        }
        
    </div>
  )
}

export default Post