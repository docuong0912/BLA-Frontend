import React, { useEffect, useState } from 'react'
import useFetch from '@/hooks/useFetch'
import { useRouter } from 'next/router'
import Loader from '../Loader';
const DashBoard = () => {
    const router = useRouter();
    const user = useFetch(`https://localhost:7051/api/Courses/users?id=${router.query.courseId}`);
    const assignment = useFetch(`https://localhost:7134/api/Assignments?course_id=${router.query.courseId}`)
    const [studentCount,setStudentCount] = useState(0);
    useEffect(()=>{
        if(user){
            fetchStudent();
        }
    },[user])
    const fetchStudent = async()=>{
        const user_id = user.map(u=>{
            return u.user_id
        })
        const userRequests = user_id.map(userId =>
            fetch(`https://localhost:7277/api/Students/is-student?user_id=${userId}`,{
                method:'GET'
            })
          );
          try {
            const responses = await Promise.all(userRequests);
            const users = await Promise.all(responses.map(response => response.json()));
            users.forEach(u=>{
                if(u){
                    setStudentCount(s=>s+1);
                }
            })
           
            // Process the fetched users as needed
          } catch (error) {
            console.error("Error fetching users:", error);
          }
    }
    if(!user || !assignment) return <Loader/>
   
  return (
    <div>
        <div>
            <div className='bg-secondary p-3 bg-opacity-50 col-3 d-inline-block mx-3'>
                <b className='text-center'>Total number of student</b>
                <p className='text-center'>{studentCount}</p>
            </div>
            <div className='bg-secondary p-3 bg-opacity-50 col-3 d-inline-block'>
                <b className='text-center'>Available assignment</b>
                <p className='text-center'>{assignment.length}</p>
            </div>
        </div>
    </div>
  )
}

export default DashBoard