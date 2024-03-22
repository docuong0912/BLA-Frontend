import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-solid-svg-icons'
import CourseDataService from '../../data-service/CourseDataService';
const AnnouncementToast = ({ title, description, courseId }) => {
    const [course, setCourse] = useState();
    useEffect(() => {
        const fetchCourse = async () => {
            const res = await CourseDataService.getCourseById(courseId);
            setCourse(res)
        }
        if (!course) {
            fetchCourse();
        }
    })
  return (
    <div className="d-flex justify-content-center p-2">
        
	
        <FontAwesomeIcon className='fs-1 mx-3' icon={faBell}/>
		<div className="media">
  			
  			<div className="media-body">
    			<h5> {course?.course_name}</h5>
				<b>{title}</b>
    			<small className="text">{description}</small>
  			</div>
		</div>
	
</div>


  )
}

export default AnnouncementToast