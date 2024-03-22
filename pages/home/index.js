import Layout, { useAnnouncementContext, useClaimContext } from '@/components/Layout';
import HomePage from '@/components/home/HomePage';
import { useEffect, useState } from 'react';
import Loader from '@/components/Loader';
import { notification_nofiy } from '@/components/notify/notify';
import CourseDataService from '../../data-service/CourseDataService';


const Home = () => {
    const claims = useClaimContext();
    const announcement = useAnnouncementContext();
    const [course, setCourse] = useState([]);
    useEffect(() => {
        if (announcement) {

            
        }
    }, [announcement])
    useEffect(() => {
        const fetchCourse = async () => {
            const course = await CourseDataService.getAllCourse(claims.user_id);
            setCourse(course)
        }
        if (course?.length==0) {
            fetchCourse();
        }
        
    },[course])
  if(!course) return <Loader/>
  return (
    <div>
      {
        claims? <HomePage role={claims.role_name} id={claims.user_id} data2={course}/>:<Loader/>
       
      }
      
    </div>
    
  )
}

export default Home;
Home.getLayout = (page)=>{
  return(
    <Layout >
      
        {page}
     
      
        
      
    </Layout>
  )
}
