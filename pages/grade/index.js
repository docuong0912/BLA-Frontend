import Layout, { useClaimContext } from '@/components/Layout'
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation,faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import CourseDataService from '../../data-service/CourseDataService';
import AssessmentDataService from '../../data-service/AssessmentDataService';
import UserDataService from '../../data-service/UserDataService';
const Grade = () => {
    const claims = useClaimContext();
    const router = useRouter();
    const [assignments, setAssignment] = useState();
    const [students,setStudent] = useState()
    const [submissions, setSubmission] = useState();
    const [course, setCourse] = useState();
    useEffect(() => {
        if (claims.role_name != "Lecturer") {
            router.push(router.asPath.replace("grade", "error/403"));
            return;
        }
            
        const fetchCourse = async () => {
            const res = await CourseDataService.getCourseById(router.query.course_id)
            setCourse(res)
        }
        const fetchSubmissions = async () => {
            const res = await AssessmentDataService.GetAllSubmission();
            setSubmission(res)
        }
        const fetchStudents = async () => {
            const res = await UserDataService.getAllStudentByCourse(router.query.course_id)
            setStudent(res)
        }
        const fetchAssignment = async () => {
            const res = await AssessmentDataService.GetAllAssignmentByCourseId(5);
            
            setAssignment(res)
        }
        if (!course) {
            fetchCourse();
        }
        if (!submissions) {
            fetchSubmissions();
        }
        if (!students) {
            fetchStudents();
        }
        if (!assignments) {
            fetchAssignment();
        }
        
    }, [assignments])
    const viewSubmission = (aid,c_name,uid)=>{
        router.push({
            pathname:`courses/assignment/${aid}`,
            query:{
                "title":c_name,
                user_id:uid
            }
        })
    }
  return (
    <div className='bg-secondary bg-opacity-10 p-3'>
        <h3>Grade Center</h3>
        <div className='bg-light'>
            <p>Grade Information Bar</p>
            <table className='table'>
                <thead>
                    <tr>
                        <th scope='col'><input type='checkbox'/></th>
                        <th scope='col'>Name</th>
                        <th scope='col'>ID</th>
                        <th scope='col'>Total</th>
                        {
                        
                                assignments?.map(a=>{
                                    return(
                                        <th key={a.assignment_id} scope='col'>{a.assignment_title}</th>
                                    );
                                })
                           
                        }
                        
                    </tr>
                </thead>
                <tbody>
                    {
                        students?.map(s=>{
                            return(
                                <tr key={s.student_id}>
                                    <th scope='row'><input type='checkbox'/></th>
                                    <td>{s.name}</td>
                                    <td>{s.student_id}</td>
                                    <td>0</td>
                                    {
                                        assignments?.map((a, ak) => {
                                            const submissionCount = submissions?.filter(
                                            (sub) => sub.user_id === s.user_id && sub.assignment_id === a.assignment_id
                                            );
                                            const submissionGrade = submissionCount.filter(s=>s.grade != null);
                                            const needsGradingCount = submissionCount.length > 0 ? 1 : 0;
                                            const emptyCount = Math.max(assignments.length - needsGradingCount, 0);

                                            const dotsArray = new Array(emptyCount).fill('../.');

                                            return (
                                            <td key={a.assignment_id}>
                                                {submissionGrade.length>0?<FontAwesomeIcon 
                                                icon={faCircleCheck} style={{color:"#00bd26"} } onClick={() => viewSubmission(a.assignment_id, course.course_name, s.user_id)}
                                                data-toggle="tooltip"
                                                data-placement="right"
                                                title="Needs Grading"
                                                className="hover fs-4"/>
                                                :submissionCount.length > 0 ? (
                                                <FontAwesomeIcon
                                                    onClick={() => viewSubmission(a.assignment_id, course.course_name, s.user_id)}
                                                    data-toggle="tooltip"
                                                    data-placement="right"
                                                    title="Needs Grading"
                                                    className="hover fs-4"
                                                    icon={faTriangleExclamation}
                                                    style={{ color: 'ffea00' }}
                                                />
                                                ) : (
                                                dotsArray.map((dots, index) => <span key={index}>{index<1?dots:""}</span>)
                                                )}
                                            </td>
                                            );
                                        })
                                }
                                    
                                    
                                </tr>
                            );
                        })
                    }
                   
                </tbody>
            </table>
        </div>
    </div>
  )
}

export default Grade
Grade.getLayout= page=>{
    return(
        <Layout>
            {page}
        </Layout>
    );
}