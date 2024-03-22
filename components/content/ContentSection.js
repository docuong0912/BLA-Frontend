import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown,faPlus } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useState,useEffect } from 'react';
import { useClaimContext } from '../Layout';
import { useRouter } from 'next/router';
import Loader from '../Loader';
import AssessmentDataService from '../../data-service/AssessmentDataService';
const ContentSection = ({ handleTabActive }) => {
    const claims = useClaimContext();
    const [activeTab,setTab] = useState([0,0,0]);
    const router = useRouter();
    const [content, setContent] = useState();
    const [postReady,isPostReady] = useState(true)
    const [PresessionContent,setAvailablePresession] = useState([]);
    const [weekDate, setWeekDate] = useState();
    const isLecturer = claims.role_name == "Lecturer";
    function getWeekDates() {
        var today = new Date();
        var day = today.getDay(); // Get the current day (0-6, where 0 is Sunday)
        var monday = new Date(today); // Create a new date object
        monday.setDate(today.getDate() - day + (day === 0 ? -6 : 1)); // Calculate Monday of the current week
    
        var sunday = new Date(today); // Create a new date object
        sunday.setDate(monday.getDate() + 6); // Calculate Sunday of the current week
        
        return { monday, sunday }; // Return an object containing Monday and Sunday dates
    }
    function getMonthName(date) {
        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return months[date?.getMonth()];
    }
    useEffect(()=>{
        setWeekDate(getWeekDates());
        const fetchContent = async () => {
            const content = claims.role_name == "Lecturer" ? await AssessmentDataService.GetContentByCourseId(router.query.courseId) : await AssessmentDataService.GetContentByUserId(claims.user_id, router.query.courseId);
            setContent(content)
        }
        if (!content) {
            fetchContent();
        }
    },[])
    useEffect(() => {
        if (content) {

            content?.map((c, k) => {
                if (c.prerequisite?.userContents.find(uc => uc.user_id == claims.user_id)?.isFinish || !c.prerequisite || isLecturer) {
                    setAvailablePresession(pre => {
                        const temp = [...pre];
                        temp[k] = true;
                        return temp;
                    })
                }

            })

        }

    }, [content]);
    useEffect(() => {
        console.log(PresessionContent)
    })
    if(!content ) return <Loader/>
  return (
    <div>
          <h3>{getMonthName(weekDate?.monday) + ' ' + weekDate?.monday.getDate()} - {getMonthName(weekDate?.sunday) + ' ' + weekDate?.sunday.getDate()}</h3>
          <div className='d-flex justify-content-between bg-info p-3' onClick={() => { setTab([!activeTab[0], activeTab[1], activeTab[2]]) }}>
                <p>Pre-Session</p>
                
                <div className={`${claims.role_name!="Lecturer"?'d-none':""}`}>
                            <FontAwesomeIcon className='d-inline-block' icon={faPlus} />
                  <Link href={{ pathname: '/content/Create', query: { course_id: router.query.courseId, type: 'presession' }}}>Create New Assesment</Link>
                </div>
                <FontAwesomeIcon className={`arrow-down ${activeTab[0]?"active":""}`}  icon={faChevronDown}/>
            </div>
             <div className={`frame ${activeTab[0]  ?"active":""}`}>
                <div >
                    <section className="todo-cmp">
                            <ul className="todo-cmp__list">
                                {content.map((c,k)=>{
                                    if(c.content_type == "presession")
                                        return (
                                            <li key={c.content_id} onClick={() => {
                                                if (c.prerequisite)
                                                    if (!PresessionContent[k])
                                                    return;
                                                router.push({
                                                    pathname: `/content/${c.content_id}`, query: { 'course_id': router.query.courseId }
                                                })
                                            }}>
                                            <label htmlFor={`todo-${c.content_id}`}>
                                                    <input id={`todo-${c.content_id}`} type="checkbox" readOnly disabled checked={c.userContents?.find(uc => uc.user_id == claims.user_id)?.isFinish}/>
                                                    <span className={`${PresessionContent[k] ? "" : "disabled"}`}>
                                                        {c.title}
                                                        {c.prerequisite ?
                                                            <div className="d-flex justify-content-start align-items-center">
                                                                <div className="bg-danger bg-opacity-50 col-1">
                                                                    <p className="text-white">Restricted</p>
                                                                </div>
                                                                <p className="mx-2 text-danger">Required {content.find(ca => ca.content_id == c.prerequisitecontent_id).title}</p>
                                                            </div>
                                                            : ""}
                                                       
                                                    </span>
                                                </label>
                                               
                                        </li>
                                    );
                                })}
                                
                        </ul>
                    </section>
                </div>
            </div>
          <div className='d-flex justify-content-between mt-4 bg-info p-3' onClick={() =>  setTab([activeTab[0], !activeTab[1], activeTab[2]]) }>
              <p>In-class</p>
              <div className={`${claims.role_name != "Lecturer" ? 'd-none' : ""}`}>
                  <FontAwesomeIcon className='d-inline-block' icon={faPlus} />
                  <Link href={{ pathname: '/content/Create', query: { course_id: router.query.courseId,type:'inclass' } }}>Create New Assesment</Link>
              </div>
              <FontAwesomeIcon className={`arrow-down ${activeTab[1] ?"active":""}`} icon={faChevronDown}/>
            </div>
            <div className={`frame ${activeTab[1]?"active":""}`}>
                <div >
                    <section className="todo-cmp">
                            <ul className="todo-cmp__list">
                            {content.map(c=>{
                                    if(c.content_type == "inclass")
                                    return(
                                        <li key={c.content_id} onClick={()=>router.push({pathname:`/content/${c.content_id}`,query:{'course_id':router.query.courseId}})}>
                                            <label htmlFor={`todo-${c.content_id}`}>
                                                <input id={`todo-${c.content_id}`} type="checkbox" readOnly disabled checked={c.userContents?.find(uc => uc.user_id == claims.user_id)?.isFinish} />
                                                <span>{c.title}</span>
                                            </label>
                                        </li>
                                    );
                                })}
                        </ul>
                    </section>
                </div>
            </div>
          <div className='d-flex justify-content-between mt-4 bg-info p-3' onClick={() =>  setTab([activeTab[0], activeTab[1], !activeTab[2]])}>
              <p>Post-Session</p>
              <div className={`${claims.role_name != "Lecturer" ? 'd-none' : ""}`}>
                  <FontAwesomeIcon className='d-inline-block' icon={faPlus} />
                  <Link href={{ pathname: '/content/Create', query: { course_id: router.query.courseId, type: 'postsession' } }}>Create New Assesment</Link>
              </div>
              <FontAwesomeIcon className={`arrow-down ${activeTab[2] ?"active":""}`} icon={faChevronDown}/>
            </div>
            <div className={`frame ${activeTab[2]?"active":""}`}>
                <div >
                    <section className="todo-cmp">
                            <ul className="todo-cmp__list">
                            {content.map(c=>{
                                    if(c.content_type == "postsession")
                                    return(
                                        <li key={c.content_id} onClick={()=>{if(!postReady)return;router.push({pathname:`/content/${c.content_id}`,query:{'course_id':router.query.courseId}})}}>
                                            <label htmlFor={`todo-${c.content_id}`}>
                                                <input id={`todo-${c.content_id}`} type="checkbox" readOnly disabled checked={c.userContents?.find(uc => uc.user_id == claims.user_id)?.isFinish} />
                                                <span className={`${!postReady?"disabled":""}`}>{c.title}</span>
                                            </label>
                                        </li>
                                    );
                                })}
                        </ul>
                    </section>
                </div>
            </div>
    </div>
   
  



  )
}

export default ContentSection