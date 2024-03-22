import Layout, { useClaimContext } from '@/components/Layout';
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import { faChevronDown,faBriefcase,faScrewdriverWrench } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Submit from '@/components/Submit';

import Link from 'next/link';
import AssessmentDataService from '../../../data-service/AssessmentDataService';

const Assignment = () => {
    const claims = useClaimContext();
    const [input, setInput] = useState(false);
    const [grade, setGrade] = useState();
    const router = useRouter();
    const [chevronActive, setActive] = useState(0)
    const course_name = router.query.title;
    const assignmentId = router.query.assignmentId;
    const [assignment, setAssignment] = useState();
    const [isSubmit,setSubmit] = useState(false)
    const handleDownload = async (file) => {
        await fetch(`/api/download?filename=${file.file_name}&file_path=${file.file_path}`)
    }
    useEffect(() => {
        const fetchAssignmentById = async () => {
            const assignment = await AssessmentDataService.GetAssignmentById(assignmentId);
            setAssignment(assignment)
        }
        if (!assignment) {
            fetchAssignmentById();
        }

    }, [])
    const handleSubmnit = async (e) => {
        if (e.key == 'Enter') {
            setGrade(e.target.value)
            const grading = await AssessmentDataService.Grading(assignment?.submissions[assignment.submissions.length - 1].submission_id,e.target.value)

            setInput(false)
        }

    }
    if (assignment?.submissions.length == 0 || isSubmit) return <Submit setSubmit={setSubmit} setAssignment={setAssignment} assignment={assignment} assignmentId={assignmentId} />
  return (
    <div className='bg-secondary bg-opacity-10 p-3'>
      <h2 className='text-center'>Review Submission : {course_name}</h2>
      <div className='col-11 row p-2 bg-white mx-auto assignment-container'>
          <div onClick={()=>setActive(0)} className='bg-secondary bg-opacity-50 text-white col-7 '>
            <b className='text-center'>Assignment Instruction <FontAwesomeIcon className={`chevron ${chevronActive==0?"active":""}` }icon={faChevronDown}/></b>
            <div className='instruction bg-lignt '>
              
                
                 
                    <div  className='m-5 p-3 bg-light col-6 mx-auto d-flex flex-column justify-content-around align-items-center'>
                      <FontAwesomeIcon className='fs-1 text-black' icon={faBriefcase}/>
                          <p ><a href={`/${assignment?.files.file_type}/${assignment?.files.file_name}`} target='_blank'>{assignment?.files.file_name}</a> </p>
                          <button onClick={() => handleDownload(assignment?.files)} className='btn btn-large btn-info'>Download</button>
                    </div>
                     
                  
               
              
              <div className='bg-light p-5 d-flex align-items-start'>
                
                    
                     
                        <div className='m-5 p-3 bg-light col-6 mx-auto d-flex flex-column justify-content-around align-items-center'>
                              <FontAwesomeIcon className='fs-1 text-black' icon={faScrewdriverWrench} />
                              <p ><a href={`/${assignment?.submissions[assignment?.submissions.length - 1].files?.file_name}`} target='_blank'>{assignment?.submissions[assignment.submissions.length - 1].files.file_name}</a> </p>
                              <button className='btn btn-large btn-info'><Link href={`/api/download?filename=${assignment?.submissions[assignment.submissions.length - 1].files?.file_name}&filepath=${assignment?.submissions[assignment.submissions.length - 1].files.file_path}`} >Download</Link></button>
                        </div>
                         
                      
                    
                
              </div>
            </div>
          </div>
          <div className='col-5 bg-dark bg-opacity-75'>
            <div className=''>
              <b className='text-white border-bottom'>Assignment Details</b>
              <div onClick={()=>setInput(true)} className='d-flex justify-content-between align-items-start'>
                <b className='text-white'>Grade</b>
                          <p className='text-white' >{input && claims.role_name == "Lecturer" ? <input type='number' onKeyDown={e => handleSubmnit(e)} /> : assignment?.submissions[assignment.submissions.length - 1].grade||grade||"-"}/100</p>
              </div>
            </div>
            <div className='attempt '>
                      <b>Attempt</b>
                      <p>{assignment?.submissions.length} /{assignment?.attemp}</p>
            </div>
            <div className='bg-light submission'>
              <b>Submmision</b>
                <div>
                  <b>Comment</b>
              </div>
                  </div>
                  {
                      assignment?.submissions.length <=assignment?.attemp  ?<button onClick={() => setSubmit(true)} type="button" className="btn btn-sm btn-light m-2 d-none">Re-do</button>:""
                  }
                  
          </div>
          
      </div>
    </div>
  )
}

export default Assignment;
Assignment.getLayout=(page)=>{
  return(
    <Layout>
      {page}
    </Layout>
  );
};
