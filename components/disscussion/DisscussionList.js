import Image from 'next/image'
import { fetchUserList } from './utils';
import { useEffect, useState } from 'react';
import CommentDetailBox from './CommentDetailBox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useClaimContext, useSocketContext, useVoteContext } from '../Layout';
import PostDataService from '../../data-service/PostDataService';
import PostLoader from'../loader/PostLoader'
import  CreatePost  from './CreatePost';


const DisscussionList = ({ disscussion, course, setDisscussion }) => {

    const [votePost, setVotePost] = useState()
    const [commentVote,setCommentVote] = useState()
    const [users, setUser] = useState();
    const [comment, setComment] = useState([]);
    const [openComment, setOpen] = useState(false);
    const [post, setPost] = useState();
    const claims = useClaimContext();
    const [commentList, setCommentList] = useState(disscussion?.map(d => d.comment));
    const socket = useSocketContext();
    useEffect(() => {
        
        setCommentList(disscussion?.map(d => d.comment));
    }, [disscussion])
    useEffect(() => {

        
            setVotePost(disscussion?.map(d => d.votes))
        
        
            setCommentVote(disscussion?.map(d => d.comment.map(c => c.votes)))
        

    }, [disscussion])
    const UpdateVote = (status,vote) => {
        let temp = [...votePost];
        if (status) {
            temp.push(vote)
        }
        else {
            const index = temp.findIndex(v => v.vote_id == vote.vote_id);
            temp[index] = vote;

        }
        setVotePost(temp);
    }

    const vote = async (upvote, post = null, comment = null) => {
        const comment_vote = comment?.votes?.find(v => v.user.slice(-1) == claims.user_id && comment.id == v.comment_id);
        const post_vote = post?.votes?.find(v => v.user.slice(-1) == claims.user_id && post.post_id == v.post_id);
        const vote_update = {
            "vote_id": post ? post_vote?.vote_id : comment_vote?.vote_id,
            "user": claims.role_name + "/" + claims.user_id,
            "up_vote": upvote,
            "post_id": post?.post_id,
            "comment_id": comment?.id
        }
        const vote_new = {
            "user": claims.role_name + "/" + claims.user_id,
            "up_vote": upvote,
            "post_id": post?.post_id,
            "comment_id": comment?.id
        }
        if (comment_vote || post_vote) {
            const res = await PostDataService.UpdateVote(vote_update, post ? post_vote?.vote_id : comment_vote.vote_id)
            UpdateVote(false, vote_update)
        }
        else {
            await PostDataService.UploadNewVote(vote_new)
            UpdateVote(true, vote_new)
        }
       
    }
    const handleOpenCommentBox = (post) => {
        setOpen(true);
        setPost(post);
        
    }
    const sendComment = async (pid, comment, setComment, key = null) => {

        if (comment[key] == '') return;
        const commentBody = {
            "comment_content" : comment[key],
            "user": claims.role_name + "/" + claims.user_id,
            "post_id":pid
        }
       

        const res = await PostDataService.PostComment(commentBody);
       
        setCommentList(c=>[...c,res])
        setComment(c => { return { ...c, [key]: '' } });
    }
    useEffect(() => {
        const fetchData = async (disscussion) => {
            const userData = await fetchUserList(disscussion);
            setUser(userData);
        };

        disscussion?.forEach(d=>fetchData(d));
    }, [disscussion])
    
    return ( 
        <div className="d-flex flex-column flex-shrink-1 bg-light p-4 col-5">
            <CreatePost setDisscussion={setDisscussion } />
            <CommentDetailBox sendComment={sendComment} openComment={openComment} setOpen={setOpen} post={post} users={users} />
            {
                disscussion?.length!=0 ? disscussion?.map((d,k) => {
                    return (
                        <div key={d.post_id} className="bg-white p-2 rounded-3 my-3">
                           
                            <div className="d-flex">
                                <Image className="me-3 rounded-3" src="/course-profile/os.jpg" alt="course avatar" width={50} height={50} />
                                <div>
                                    <b>{course?.find(c => c.course.course_id == d.course_id)?.course.course_name} Group {course.find(c => c.course.course_id == d.course_id)?.course.course_group_no}</b>
                                    <div className="d-flex">
                                        <p className="text-secondary text-opacity-75">{users?.find(u=>u.user_id == d.create_by.slice(-1)).name}</p>
                                        <p className="text-secondary text-opacity-75 mx-3">{d.post_created.slice(0, 10)} {d.post_created.slice(11,16) }</p>
                                    </div>

                                </div>

                            </div>
                            <div className="d-flex">
                                <div className="d-flex flex-column justify-content-between align-items-center">
                                    <FontAwesomeIcon onClick={() => { vote(true, d)}} icon={faChevronUp} />
                                    <p >{votePost[k]?.reduce((p, current) => p + (current.up_vote ? 1 : -1), 0)}</p>
                                    <FontAwesomeIcon onClick={() => vote(false, d)} icon={faChevronDown} />
                                </div>
                                <p className="mx-3 p-2">{d.post_content }</p>
                            </div>
                            <hr />
                            <p onClick={() => handleOpenCommentBox(d)} className={`${d.comment?.length > 2 ? "" : "d-none"} mx-5 text-info`}>View more commments</p>
                            {
                                commentList[k]?.slice(0, 2).map((c,ck) => {
                                    return (
                                        <div key={c.id }>
                                            <div className="d-flex m-4">
                                                <div className="d-flex flex-column">
                                                    <Image src={"/avatar/no-avatar.jpg"} width={50} height={50} className='rounded-circle' alt='avatar' />
                                                    <div className="d-flex flex-column  justify-content-between align-items-center">
                                                        <button type="button" className="btn"><FontAwesomeIcon onClick={() => vote(true, null, c)} icon={faChevronUp} /></button>
                                                        
                                                        <FontAwesomeIcon onClick={() => vote(false, null, c)} icon={faChevronDown} />
                                                    </div>
                                                </div>

                                                <div className="p-2 rounded-3 bg-light mx-4 col">
                                                    <b>{users?.find(u => u.user_id == c.user.slice(-1))?.name}</b>
                                                    <p>{c.comment_content}</p>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <p className="text-secondary text-opacity-75">{c.create_at.slice(5, 10)} {c.create_at.slice(11, 16)}</p>
                                                        <p className="">reply</p>
                                                    </div>

                                                </div>
                                            </div>
                                            
                                        </div>
                                    );
                                })
                            }
                            <div className="d-flex">
                                <Image src={"/avatar/no-avatar.jpg"} width={50} height={50} className='rounded-circle mx-2' alt='avatar' />
                                <div className='input-group d-flex align-items-center'>
                                    <textarea value={comment[k]} onChange={e => setComment(c => { return { ...c, [k]: e.target.value } })} className='form-control rounded-3' type='text' />
                                    <button onClick={() => sendComment(d.post_id, comment, setComment, k)} className='btn btn-lg btn-info '>Comment</button>
                                </div>

                            </div>
                            
                            
                        </div>
                    );
                }) : <PostLoader />
            }
           
            
            
        </div>
    );
}
export default DisscussionList;