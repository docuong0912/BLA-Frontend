import Layout from '@/components/Layout';
import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus,faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import CreateDisscussion from '@/components/disscussion/CreateDisscussion';

import { useRouter } from 'next/router';
import Loader from '@/components/Loader';
import Post from '@/components/disscussion/Post';
const Disscussion = () => {
    const [createBox,setCreateBox] = useState(false);
    const router = useRouter()
    const disscussion = useFetch(`https://localhost:7053/api/Discussions/${router.query.disscussionId}`);
    if(!disscussion) return <Loader/>
  return (
    <div>
        {!createBox
        ? 
        <div onClick={()=>setCreateBox(true)} className='p-3'>
            <FontAwesomeIcon icon={faPlus}/>
            <p className='d-inline'>Create new Post</p>
        </div>
        :
        <FontAwesomeIcon onClick={()=>setCreateBox(false)} className='m-3' icon={faArrowLeft} />}
        
        {createBox?<CreateDisscussion/>:<Post disscussion={disscussion}/>}
    </div>
  )
}

export default Disscussion;
Disscussion.getLayout = page=>{
    return(
        <Layout>
            {page}
        </Layout>
    )
}