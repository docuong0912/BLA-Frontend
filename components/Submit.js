import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import { useClaimContext } from './Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase } from '@fortawesome/free-solid-svg-icons';
import AssessmentDataService from '../data-service/AssessmentDataService';
import { toast } from 'react-toastify';
const Submit = ({setAssignment,setSubmit, assignment, assignmentId }) => {
  const router = useRouter();
  const [file,setFile] = useState();
  const [comment,setComment] = useState('');
    const claims = useClaimContext();
  

    const course_name = router.query.title;
    const handleSubmit=async()=>{
      var file_form = new FormData();
        file_form.append("file_name",file.name);
        file_form.append("file_type","submission");
        file_form.append("file_path","")
        file_form.append("file", file)
        const fileUpload = await AssessmentDataService.PostFile(file_form);
        const TempSub = {
            "submission_date": new Date().toISOString().slice(0, 16),
            "user_id": claims.user_id,
            "assignment_id": assignmentId,
            "comment": comment,
            'filesfile_id': fileUpload.file_id
        };
       
      
      
        const submitresponse = await AssessmentDataService.UploadSubmission(TempSub)
       
        if (submitresponse) {
            toast.success("Upload Submission successfully")
            let tempAssignment = { ...assignment }
            submitresponse.files = {
                "file_name": file.name,
                "file": file
            }
            tempAssignment.submissions.push(submitresponse);
            setAssignment(tempAssignment)
            setSubmit(false)
        }
    }
  return (
    <div className='bg-secondary p-3 bg-opacity-25'>
        <h3 className='text-white'>Upload Assignment: {course_name}</h3>
        <div className='bg-light p-3'>
            <b>Assignment Information</b>
            <div className='d-flex justify-content-between align-items-center m-2'>
                <div className='d-flex justify-content-between align-items-center flex-column border col m-2'>
                    <p>Due Date</p>
                    <b>{assignment?.due_date.slice(0,10)}</b>
                    <p>{assignment?.due_date.slice(11,16)}</p>
                </div>
                <div className='d-flex justify-content-between align-items-center flex-column border col m-2'>
                  <p>Point possible</p>
                  <b>100</b>
                </div>
              </div>
              
                  <div className='m-5 p-3 bg-light col-6 mx-auto d-flex flex-column justify-content-around align-items-center'>
                      <FontAwesomeIcon className='fs-1 text-black' icon={faBriefcase} />
                      <p ><a href={`/${assignment?.files.file_type}/${assignment?.files.file_name}`} target='_blank'>{assignment?.files.file_name}</a> </p>
                      <button className='btn btn-large btn-info'>Download</button>
                  </div>
              
            <div className='form-group border border-2 p-3 m-2'>
              <label for="File">Attach File</label>
              <input onChange={e=>setFile(e.target.files[0])} className='d-block' type="file"  id="File"/>
            </div>
            <div className='m-2'>
              <b>Add comment</b>
              <textarea onChange={e=>setComment(e.target.value)}  name='assignment_description' className="form-control form-control-lg" id="assignment_desciption" rows="3"></textarea>
         
            </div>
            <button onClick={handleSubmit} className='btn btn-large btn-info m-3'>Submit</button>
        </div>
    </div>);
}

export default Submit