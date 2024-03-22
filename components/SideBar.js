
import { useEffect, useState } from 'react';
import {faPlus,faLaptopFile } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import ContentHeader from './content/ContentHeader';
import ContentSection from './content/ContentSection';
import { useDecodeJwt } from '../hooks/useDecodeJwt';
import { useAnnouncementContext, useAssignmentContext } from './Layout';
import AssessmentDataService from '../data-service/AssessmentDataService';
const SideBar = ({ children }) => {
    const token= Cookies.get('jwt')
    const {user_id,role_name,exp}=useDecodeJwt(token);
    
    const [active,setActive] = useState();
    const router = useRouter();
    const tab = router.query.tabSideBar
    const { courseId } = router.query;
    const announcements = useAnnouncementContext();
    const tabSide = router.query.tabSideBar;
    const [assignment,setAssignment] = useState();
    useEffect(() => {
        const fetchAssignments = async () => {
            console.log(courseId)
            const assignment = await AssessmentDataService.GetAllAssignmentByCourseId(courseId);
            console.log(assignment)
            setAssignment(assignment)
        }
        if (!assignment) {
            fetchAssignments();
        }
        
    },[assignment])
    const handleTabActive = (tabIndex, tabName, tabRouter) => {
        console.log(tabSide)
        if (tabSide) {
            router.replace(`${router.asPath.replace(tabName + '=' + tab, tabName + '=' + tabIndex)}`);
        }
        else {
            router.push(`${router.asPath}?${tabName}=${tabIndex}`)
        }
    }
  return (
    <div class="row ">
            <div class="col-md-3">
                {/* <!-- Tabs nav --> */}
                <div class="nav flex-column nav-pills nav-pills-custom" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                    {/*<div onClick={()=>setActive(0)} className={`nav-link mb-3 p-3 shadow ${active==0?"active":""}`} id="v-pills-home-tab" data-toggle="pill"  role="tab" aria-controls="v-pills-home" aria-selected={active==0?"true":"false"}>*/}
                        
                    {/*    <span class="font-weight-bold small text-uppercase">Dashboard</span></div>*/}

                  <div onClick={() => { handleTabActive(1, 'tabSideBar', tab); setActive(1); }} className={`nav-link mb-3 p-3 shadow ${active == 1 && tab == 1 ?"active":""}`} id="v-pills-profile-tab" data-toggle="pill" role="tab" aria-controls="v-pills-profile" aria-selected={active==1?"true":"false"}>
                       
                        <span className="font-weight-bold small text-uppercase">Announcements</span></div>

                  <div onClick={() => { handleTabActive(2, 'tabSideBar', tab); setActive(2); }} className={`nav-link mb-3 p-3 shadow ${active == 2 && tab == 2 ? "active" : ""}`} id="v-pills-messages-tab" data-toggle="pill" role="tab" aria-controls="v-pills-messages" aria-selected={active == 2 ? "true" : "false"}>
                        
                        <span className="font-weight-bold small text-uppercase">Content</span></div>

                  <div onClick={() => { handleTabActive(3, 'tabSideBar', tab); setActive(3); }} className={`nav-link mb-3 p-3 shadow ${active == 3 && tab == 3?"active":""}`} id="v-pills-settings-tab" data-toggle="pill" role="tab" aria-controls="v-pills-settings" aria-selected={active==3?"true":"false"}>
                        
                        <span className="font-weight-bold small text-uppercase">Assignment</span></div>
                    </div>
                    <div onClick={()=>router.push({pathname:'/grade',query:{course_id:courseId}})} className={`nav-link mb-3 p-3 shadow bg-white text-secondary ${role_name!="Lecturer"?"d-none":""} `}>
                        <span className="font-weight-bold small text-uppercase">Grading center</span>
                    </div>
                    <div onClick={()=>router.push({pathname:'group-assignment',query:{activeTab:5}})} className={` nav-link mb-3 p-3 shadow bg-white text-secondary ${role_name!="Lecturer"?"d-none":""} `}>
                        <span className="font-weight-bold small text-uppercase">Group Assignment</span>
                    </div>
            </div>
            

            <div class="col-md-9">
               
                <div className="tab-content" id="v-pills-tabContent">
                    {/*<div className={`tab-pane fade shadow rounded bg-white ${active==0?"show active ":""} p-5`} id="v-pills-home" role="tabpanel" aria-labelledby="v-pills-home-tab">*/}
                    {/*    <h4 class="font-italic mb-4">Dashboard</h4>*/}
                    {/*    <DashBoard/>*/}
                    {/*</div>*/}
                    
                  <div className={`tab-pane fade shadow rounded bg-white ${active == 1 || tab == 1 ? "show active " : ""} p-5`} id="v-pills-profile" role="tabpanel" aria-labelledby="v-pills-profile-tab">
                      {role_name=="Lecturer"? < button type="button" className="d-flex btn btn-lg btn-info justify-content-between align-items-center">
                          
                          <p>Create new announcement</p>
                      </button> : ""}
                        <h4 class="font-italic mb-4">Announcements</h4>
                        {
                            announcements?.length==0?<div>No Announcements</div>:announcements?.map(a=>{
                                return(
                                    <div className='container my-4' key={a.assignment_id}>

                                        
                                    <div className='bg-secondary p-3 text-white d-flex justify-content-around align-items-center rounded-3'>
                                        <FontAwesomeIcon className='fs-1' icon={faBell}/>
                                        <div className='flex-fill mx-5 vertical-align-center'>
                                            <b>{a.announcement_subject}</b>
                                            <p>{a.announcement_message}</p>
                                        </div>
                                        
                                    </div>
                                    
                                </div>
                                );
                            })
                        }
                        
                    </div>
                    
                  <div className={`tab-pane fade shadow rounded bg-white ${active == 2 || tab == 2?"show active ":""} p-5`}  role="tabpanel" aria-labelledby="v-pills-messages-tab">
                        <h4 class="font-italic mb-4">Content</h4>
                      <ContentHeader />
                      <ContentSection handleTabActive={handleTabActive} />
                        <div class="d-flex justify-content-start align-items-center">
                           
                        
                        </div>
                    </div>

                  <div className={`tab-pane fade shadow rounded bg-white ${active == 3 || tab == 3 ? "show active " : ""} p-5`} id="v-pills-settings" role="tabpanel" aria-labelledby="v-pills-settings-tab">
                        <h4 class="font-italic mb-4">Assignments</h4>
                        <div className={`${role_name!="Lecturer"?'d-none':""}`}>
                            <FontAwesomeIcon className='d-inline-block' icon={faPlus} />
                            <Link  href={{
                                pathname:"/courses/assignment/Create",
                                query:{course_id:courseId}
                                }}>Create Assignment</Link>
                        </div>
                        
                            {
                                assignment?.length!=0?
                                <div>
                                    {assignment?.map(a=>{
                                        return (
                                            <div key={a.assignment_id} className='container bg-light p-4 m-1 d-flex '>
                                                <FontAwesomeIcon icon={faLaptopFile} className='fs-1'/>
                                                <div className='mx-4'>
                                                    <b><Link href={{pathname:`assignment/${a.assignment_id}`,query:{user_id:user_id,course:courseId,title:a.assignment_title}}}>{a.assignment_title}</Link></b>
                                                    <p>{a.assignment_description}</p>
                                                </div>
                                                
                                            </div>
                                        
                                        )
                                    })}
                                </div>:<p class="font-italic text-muted mb-2 fs-1">No Assignments</p>
                            }
                        
                        
                    </div>
                </div>
            </div>
        </div>
  )
}

export default SideBar