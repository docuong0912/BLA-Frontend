import React, { useEffect } from 'react'
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse,faBell,faComments,faUser,faCalendarDays,faMessage } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAnnouncementContext, useClaimContext } from './Layout';
import AnnouncementBox from './announcement/AnnouncementBox';
import CourseDataService from '../data-service/CourseDataService';
const SideNavBar = ({ user, announcement }) => {
    const router = useRouter();
    const claims = useClaimContext();
    const [course, setCourse] = useState([]);
    const [openAnnounceBox, setOpen] = useState(false)
  
    
    useEffect(() => {
        const getCourseData = async () => {
            const course = await CourseDataService.getAllCourse(claims.user_id);
            setCourse(course)
        }
        getCourseData();
      
    },[])
    const handleAnnouncement = async () => {
        setOpen(true);
        const response = await fetch(`https://localhost:7132/api/Announcements/read?user_id=${user.user_id}`,{
            method:'PUT'
        });
       
    }
   
    
  return (
    <div className='d-flex justify-content-between align-items-center col-4 sidebar-container '>
         
            

          <Link className={`d-flex justify-content-center w-full h-12   ${router.query.tab == 1 ? "active" : ""} col-1 p-2`} href="/home?tab=1" >
					<FontAwesomeIcon icon={faHouse} className='fs-5 icon'/>
					
          </Link>
          <div className={`d-flex justify-content-center w-full h-12 col-1 p-2  position-relative ${router.query.tab == 2 ?"active":""}`}>
              <FontAwesomeIcon onClick={() => handleAnnouncement()} icon={faBell} className='fs-5 icon' />
              <AnnouncementBox announcement={announcement} course={course} openAnnounceBox={openAnnounceBox} setOpen={setOpen} />
              
              

                  
                <div className={`announcement-count`}>
                      {announcement?.length}
                </div>

              
          </div>
         
          <Link className={`d-flex justify-content-center w-full h-12 col-1 p-2  ${router.query.tab == 3 ? "active" : ""}`}  href={'/chat?tab=3'}>
					<FontAwesomeIcon icon={faMessage} className='fs-5 icon' />
					
                    </Link>
                
          <Link className="d-flex justify-content-center w-full h-12 col-1 p-2 " href={'/calendar'}>
                        <FontAwesomeIcon icon={faCalendarDays} className='fs-5 icon' />
                </Link>
          <Link className="d-flex justify-content-center  w-full h-12 " href={'/disscussion'}>
                          <FontAwesomeIcon icon={faComments} />
                      </Link>
				
			</div>
		
	
    
	
  )
}

export default SideNavBar