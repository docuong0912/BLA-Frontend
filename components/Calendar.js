import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight,faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { useAssignmentContext, useClaimContext, useCourseContext } from './Layout';
import AssessmentDataService from '../data-service/AssessmentDataService';
import CourseDataService from '../data-service/CourseDataService';
const Calendar = () => {
    const today = new Date();
    const claims = useClaimContext();
    const course = useCourseContext();
    const [assignments, setAssignment] = useState();
    const [flipCalender,setFlip] = useState(false);
    const curerntYear = new Date().toLocaleString('default', { month: 'long' ,year:'numeric'});
    const currentWeekDate = new Date().toLocaleString('default', { weekday: 'long'});
    const currentDate = today.getDate().toString() + today.getDate()==1?"st"
    :today.getDate()==2?"nd"
    :today.getDate()==3?"rd":"th";
    const [month,setMonth] = useState(today.getMonth());
    const [year,setYear] = useState(today.getFullYear());
    const calendaryear = new Date(year,month,today.getDate()).toLocaleString('default',{month:'long',year:'numeric'})
    const [ldlm,setLastmonth] = useState([]);
    const [tm,setThisMonth] = useState([]);
    const [nm,setNextMonth] = useState([]);
    const [todo,setTodo] = useState([]);
     // Get the first day of the month
     let dayone = new Date(year, month, 1).getDay();
 
     // Get the last date of the month
     let lastdate = new Date(year, month + 1, 0).getDate();
  
     // Get the day of the last date of the month
     let dayend = new Date(year, month, lastdate).getDay();
  
     // Get the last date of the previous month
     let monthlastdate = new Date(year, month, 0).getDate();
    useEffect(()=>{
      const lastMonthTemp = [];
      const thisMonthTemp = [];
        const nextMonthTemp = [];
      for (let index = dayone; index > 0; index--) {
        lastMonthTemp.push(monthlastdate - index + 1);
      }

      for (let index = 1; index <= lastdate; index++) {
        thisMonthTemp.push(index);
      }

      for (let index = dayend; index < 6; index++) {
        nextMonthTemp.push(index - dayend + 1);
      }

      setLastmonth(lastMonthTemp);
      setThisMonth(thisMonthTemp);
        setNextMonth(nextMonthTemp);
      
    },[month,year])
    const setCalendar = (m)=>{
      if (m < 0 || m > 11) {
 
        // Set the date to the first day of the 
        // month with the new year
        const date = new Date(year, month, new Date().getDate());

        // Set the year to the new year
        setYear(date.getFullYear());

        // Set the month to the new month
        setMonth(date.getMonth());
    }
    else{
      setMonth(m);
    }
    }
    const handleFlip=(d)=>{
      setFlip(true);
      let todolist = assignments.filter(c=>c.due_date.slice(8,10) == d.toString() && month == today.getMonth() && year == today.getFullYear());
      setTodo(todolist)
      console.log(todolist)
    }
    useEffect(() => {
        const fetchAssignment = async () => {
            
            const res = await AssessmentDataService.GetAllAssignment();
            
            const assignment = res.filter(a=>course?.some(c=>c.course.course_id == a.course_id))
            setAssignment(assignment);
        }
        if (!assignments) {
            fetchAssignment();
        }
    },[])
  return (
    
    
      <div class={`calendar ${flipCalender?"flip":""}`}>
        <div class="front">
          <div class="current-date">
            <div>
              <b className='text-white fs-4'>{currentWeekDate} {today.getDate()}{currentDate}</b>
              <p className='text-white'>{curerntYear}</p>
            </div>
            
            <FontAwesomeIcon onClick={()=>setCalendar(month-1)} icon={faChevronLeft} className='text-white'/>
            <b className='text-white'>{calendaryear}</b>	
            <FontAwesomeIcon onClick={()=>setCalendar(month+1)} icon={faChevronRight} className='text-white'/>
            
          </div>

          <div class="current-month">
            <ul class="week-days">
                <li>SUN</li>
                <li>MON</li>
                <li>TUE</li>
                <li>WED</li>
                <li>THU</li>
                <li>FRI</li>
                <li>SAT</li>
              
            </ul>

            <div className="weeks">
              <div className="d-flex flex-wrap">
                {
                   [...ldlm]?.map((d,key)=>{
                    return(<span key={key} className=" last-month">{d}</span>)
                   })
                }
                {
                    [...tm].map((d,key)=>{
                        return(
                        <span onClick={()=>handleFlip(d)}  key={key} className={` ${d==today.getDate() && month == today.getMonth() && year == today.getFullYear()?"active":""}
                        ${assignments?.some(date => date.due_date.slice(0, 4) == year.toString() && date.due_date.slice(5, 7) == (month+1).toString().padStart(2, '0') && date.due_date.slice(8, 10) == d.toString()) ? "event" : ""}`}>
                            {d}
                        </span>
                        );
                    })
                }
                {
                    [...nm].map((d,key)=>{
                        return(<span key={key} className={`last-month `}>
                            {d}
                        </span>
                        );
                    })
                }
              </div>

            </div>
          </div>
        </div>

        <div onClick={()=>setFlip(false)}  className="back ">
          {todo.length>0?todo.map(t=>{
            return(
              <div key={t.assignment_id}>
                   <h1 className='text-white text-center'>{t.assignment_title}</h1>
                  <div className="info">
                    <div className="date">
                      <p className="info-date">
                      Date: <span>{t.due_date.slice(0,10)}</span>
                      </p>
                      <p className="info-time">
                        Time: <span>{t.due_date.slice(11)}</span>
                      </p>
                    </div>
                   
                  </div>

              </div>
            );
          }):<h1 className='text-white m-2'>Nothing to do</h1>}
         
         
        </div>

      </div>
    
  )
}

export default Calendar