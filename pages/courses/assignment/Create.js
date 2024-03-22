import Layout, { useClaimContext, useSocketContext } from '@/components/Layout';
import React, { useEffect } from 'react'
import { useState,useRef } from 'react';
import { useRouter } from 'next/router';

import { assignment_notify } from '@/components/notify/notify';

import AssessmentDataService from '../../../data-service/AssessmentDataService';
import UserDataService from '../../../data-service/UserDataService';
import AnnoucementDataService from '../../../data-service/AnnouncementDataService';

const Create = () => {
  const router= useRouter();
  const claims = useClaimContext();
  const [userId,setUser] = useState()
  const multipleInputRef = useRef();
  const [multipleActive,isMultipleInputActive] = useState(false);
    const [attempNum, setAttempNum] = useState(0);
    const socket = useSocketContext();
    useEffect(() => {
        const fetchStudentInCourse = async () => {
            const students = await UserDataService.getAllStudentByCourse(router.query.course_id);
            console.log(students)
            setUser(students.map(s => ({ user_id:s.user_id,isRead:false })))
        }
        if (!userId) {
            fetchStudentInCourse();
        }
        console.log(userId)
    }, [userId]);
  useEffect(()=>{
    if(multipleInputRef.current.checked){
      isMultipleInputActive(true)
    }
    else{
      isMultipleInputActive(false)
    }
  },[attempNum])
  const [file,setFile] = useState({});
  const [dueDate, setDueDate] = useState('');
  
  const [formData,setFormData] = useState({
    assignment_title:'',
    assignment_description:'',
    start_date: new Date().toISOString().slice(0, 16),
    due_date:'',
    course_id:parseInt(router.query.course_id),
    attemp:1
  })
  useEffect(()=>{
    setFormData({ ...formData, "due_date": dueDate});
    
  },[dueDate])
  
  const handleChange = (e) => {
    
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (e) => {
    setDueDate((prevDueDate) => {
      const selectedDate = e.target.value;
      // Combine the selected date and the existing time value
      const combinedDateTime = `${selectedDate}T${prevDueDate.split('T')[1]}`;
      return combinedDateTime;
    });
  };

  const handleTimeChange = (e) => {
    setDueDate((prevDueDate) => {
      const selectedTime = e.target.value;
      // Combine the existing date value and the selected time
      const combinedDateTime = `${prevDueDate.split('T')[0]}T${selectedTime}`;
      return combinedDateTime;
    });
  };
  const  handleSubmit = async (e) => {
    e.preventDefault();
      const fileformdata = new FormData();
   
    fileformdata.append("file_name",file.name);
    fileformdata.append("file_type","assignment");
      fileformdata.append("file", file)
      const fileUpload = await AssessmentDataService.PostFile(fileformdata);
      const assignmentBody = {
          "assignment_title": formData.assignment_title,
          "assignment_description": formData.assignment_description,
          "start_date": formData.start_date,
          "due_date": dueDate,
          "attemp": attempNum,
          "course_id": router.query.course_id,
          "user_id": claims.user_id,
          "filesfile_id": fileUpload.file_id
      }
      console.log(assignmentBody)
    // Use the combined dueDate value for further processing or submission
      var announcement;
      try {
          const assignment = await AssessmentDataService.UploadAssignment(assignmentBody)
          if (assignment){
          assignment_notify();
          announcement = {"announcement_subject": "New assignment uploaded",
          "announcement_message": assignment.assignment_title,
          "course_id": router.query.course_id,
          "startDate":`${new Date().getFullYear()}-${(new Date().getMonth()+1)<10?`0${new Date().getMonth()+1}`:`${new Date().getMonth()+1}`}-${new Date().getDate()<10?`0${new Date().getDate()}`:`${new Date().getDate()}`}`,
          "endDate":`${new Date().getFullYear()}-${(new Date().getMonth()+1)<10?`0${new Date().getMonth()+1}`:`${new Date().getMonth()+1}`}-${new Date().getDate()<10?`0${new Date().getDate()}`:`${new Date().getDate()}`}`,
              "users": userId,
              "link_to": `courses/assignment/${assignment.assignment_id}?title=${assignment.assignment_title}`
        }
           const announcement_update = await AnnoucementDataService.PostAnnouncement(announcement)
              if (announcement_update) {
                  router.push(`/courses/${router.query.course_id}`);
                  socket.emit('new-announcement', router.query.course_id, announcement_update, router.query.course_id);
              }
          
        }
    }catch(err){
      console.log(err);
    }
  };
  return (
    <div className='container'>
      <h4 className='m-4'>Create Assignment</h4>
      <b>Assignment Information</b>
      <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label for="assignment_title" className='font-weight-bold' >Title:</label>
            <input name='assignment_title' id='assignment_title' type='text' onChange={handleChange}/>
          </div>
          <div class="form-group">
            <label for="assignment_desciption">Instruction</label>
            <textarea onChange={handleChange} name='assignment_description' className="form-control form-control-lg" id="assignment_desciption" rows="3"></textarea>
          </div>
          <b>Assignment file</b>
          <div class="form-group border border-2 p-3">
            <label for="File">Attach File</label>
            <input onChange={e=>setFile(e.target.files[0])} className='d-block' type="file"  id="File"/>
        </div>
        <b>Due Date</b>
        <div class="form-group">
            <label for="end_date">Due Date</label>
            <input className='col' type="date" min={new Date().toISOString().split('T')[0]}  onChange={handleDateChange}/>
            <input className='col' type="time" onChange={handleTimeChange}/>
        </div>
        <div className='form-check'>
            <input onChange={()=>setAttempNum(1)} class="form-check-input" type="radio" name="attemp" id="exampleRadios1" value="1" />
            <label class="form-check-label" htmlFor="exampleRadios1">
                Single Attempt
          </label>

        </div>
        <div  className='form-check'>
          <input onChange={()=>isMultipleInputActive(true)} ref={multipleInputRef}  class="form-check-input" type="radio" name="attemp" id="exampleRadios2" value={attempNum} />
              <label class="form-check-label" htmlFor="exampleRadios2">
                  Multiple Attempts
            </label>
            <div className={`${multipleActive?'d-block':'d-none'}`}>
              <label className='form-label'>Number of attemp:</label>
              <input onChange={(e)=>setAttempNum(e.target.value)} type='number' className='form-control col-1' />
            </div>
        </div>
        <div className='form-check'>
        <input onChange={()=>setAttempNum(-1)} class="form-check-input" type="radio" name="attemp" id="exampleRadios3" value="null"/>
            <label class="form-check-label" htmlFor="exampleRadios3">
                Unlimited Attempts
          </label>
        </div>
        <button className='btn btn-lg btn-info' type='submit'>Submit</button>
      </form>
      
    </div>
  )
}

export default Create;
Create.getLayout = (page)=>{
    return(
        <Layout>
            {page}
        </Layout>
    );
}