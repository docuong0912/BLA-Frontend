import Layout, { useClaimContext, useCourseContext } from '@/components/Layout'
import React, { useEffect,useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus,faComment } from '@fortawesome/free-solid-svg-icons'
import Loader from '@/components/Loader'
import { useRouter } from 'next/router';
import { fetchUserList } from '@/components/disscussion/utils'
const Disscussion = () => {
    const claims = useClaimContext();
    const [filterDisccussion,setDisscussion] = useState();
    const [user,setUser] = useState();
    const router = useRouter();
    const course = useCourseContext();
    useEffect(() => {
        
        
        const filter = disscussions?.filter(d=>d.users.filter(u=>{
            u.user.slice(-1)== claims.user_id
        }))
        const fetchData = async (disscussion) => {
            const userData = await fetchUserList(disscussion);
            console.log(userData); 
            setUser(userData);
        };
        filter?.forEach(element => {
            fetchData(element);
        });
        
        setDisscussion(filter)
    },[disscussions])
    if(!disscussions ) return <Loader/>
  return (
    <div>
        <div className='p-3 d-flex justify-content-around align-items-center col-2'>
            <FontAwesomeIcon icon={faPlus}/>
            <p className='align-self-center'>New Disscussion</p>
        </div>
        <div>
            {
                filterDisccussion?.map((f)=>{
                    return(
                        <div onClick={()=>router.push(`/courses/disscussion/${f.disscussion_id}?cid=${f.course_id}`)} className='mx-5 bg-secondary bg-opacity-10 p-3 position-relative' key={f.disscussion_id}>
                            <FontAwesomeIcon icon={faComment} className='fs-1'/>
                            <div className='p-2  d-inline-block'>
                                <b className='fs-4'>{f.name}</b>
                                <p>{f.description}</p>
                            </div>
                            <div className='position-absolute end-0 top-0 p-3'>
                                <div>
                                    <p className='d-inline text-secondary'>Created by {user?.find(u=>u.user_id == f.creator).name}</p>
                                    <p className='d-inline text-secondary'> ({f.posts.length} {f.posts.length==1?"post":"posts"})</p>
                                </div>
                               <div>
                                    <p className='d-inline text-secondary'>Created at {f.create_at}</p>
                               </div>
                            </div>
                        </div>
                    );
                })
            }
           
        </div>
    </div>
  )
}

export default Disscussion
Disscussion.getLayout = page =>{
    return(
        <Layout>
            {page}
        </Layout>
    );
}