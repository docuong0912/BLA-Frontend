import React, { useEffect,useState } from 'react';
import { useRouter } from 'next/router';
import Layout, { useCourseContext } from '@/components/Layout';


import SideBar from '@/components/SideBar';
import InfoBox from '@/components/InfoBox';
import CourseDataService from '../../data-service/CourseDataService';
import UserDataService from '../../data-service/UserDataService';

const Course = () => {
    const router = useRouter();
   
    const { courseId } = router.query;
    const course = useCourseContext()?.find(c => c.course.course_id == courseId);
    const [lecturer, setLecturer] = useState()
    useEffect(() => {
        const fetchLecturer = async () => {
            const lecturer = await UserDataService.getLecturerByCourse(courseId);
            setLecturer(lecturer)
        }
        if (!lecturer) {
            fetchLecturer();
        }
    },[])
    return (
        <div className='m-5 '>

            <h2 className=' d-inline'>{course?.course.course_name}</h2>
            <div className='position-relative  mx-5 d-inline'>
                <p>Lecturer: {lecturer?.name}</p>
                <InfoBox user = {lecturer}/>
            </div>
            
        </div>
            
            
        
    )
    
}

export default Course;
Course.getLayout=(page)=>{
    return(
        <Layout>
            <div className='bg-secondary bg-opacity-10 container-fluid course-info'>
                {page}
                <SideBar/>
            
            </div>
            
        </Layout>
    )
}
