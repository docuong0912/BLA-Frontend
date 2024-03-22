import Layout from '@/components/Layout'
import SideNavBar from '@/components/SideNavBar'
import React from 'react';
import { useEffect,useState } from 'react';
import { useClaimContext } from '@/components/Layout';
import Loader from '@/components/Loader';
const Calendar = () => {
    const claims = useClaimContext();
    const course = useFetch(`https://localhost:7051/api/Courses/get-course-by-user-id?id=${claims.user_id}`);
    const [due_dates,setDueDate] = useState([]);
    
    useEffect(()=>{
      if(course){
        let count=0
        course.map(c=>{
            c.assignment.map((a)=>{
                setDueDate(d=>{return [...d,a.due_date]});
               
            })
          }); 
   
      }
      
    },[course])
    if(!course)return <Loader/>
    const assignmentData = course.flatMap(c => c.assignment.map(a =>{return {
        title: a.assignment_title,
        start: a.due_date.slice(0,a.due_date.length-1),
        
        // Add more properties as needed
      }})); // Extract the desired property from each element
    const serializedProperties = encodeURIComponent(JSON.stringify(assignmentData));
  
    return (
      <iframe className="calendar col-11" src={`./calendar-20/index.html?properties=${serializedProperties}`}></iframe>
    );
}

export default Calendar
Calendar.getLayout = page=>{
    return(
    <Layout>
        <SideNavBar>{page}</SideNavBar>
    </Layout>
    );
    
}