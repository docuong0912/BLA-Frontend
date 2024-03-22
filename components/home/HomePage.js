import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import Calendar from '../Calendar';
import HomeLoader from '../loader/HomeLoader';
import DisscussionList from '../disscussion/DisscussionList';
import PostDataService from '../../data-service/PostDataService';
import UserDataService from '../../data-service/UserDataService';
import { useAnnouncementContext, useSocketContext } from '../Layout';


const HomePage = ({ role, id, data2 }) => {
    const announcement = useAnnouncementContext();
    const [disscussion, setDisscussion] = useState([])
    const [user, setUser] = useState();
    const socket = useSocketContext();
    const fetchPost = async () => {
        const post = await PostDataService.ViewAllPost();
        setDisscussion(post)
    }
    useEffect(() => {
        
       
        const fetchUser = async () => {

            const res = role == "Lecturer" ? await UserDataService.getLecturerInfo(id) : await  UserDataService.getStudentInfo(id);
            setUser(res)
        }
        if (disscussion?.length==0) {
            fetchPost();
        }
        if (!user) {
            fetchUser();
        }

    }, [disscussion,user])

    useEffect(() => {
        socket.on('handleChangePost', () => {
            console.log("post new")
            fetchPost();
        });
        socket.on('error', (error) => {
            console.error('Socket error:', error);
        });
        return () => {
            // Cleanup code
            socket.off('handleChangePost');
            socket.off('error');
        };
    }, [socket])


   
    return (
      <div >
        
            <h1 className='m-5'>Welcome,{user?.name}</h1>
            <div className="d-flex ">

                <div className='d-flex flex-shrink-1 flex-column justify-content-start align-items-start outer-box'>

                    <div className='d-flex box '>

                        <div className='border my-2 bg-light col'>
                            <div className='bg-info p-2'>
                                <b>My Course</b>
                            </div>
                            {
                                data2?.length!=0 ? data2.map(c => {
                                    return (
                                        <div key={c.course.course_id} className='p-3 '>

                                            <div className='border-bottom'>
                                                <b><Link href={{ pathname: `courses/${c.course.course_id}`}}>{c.course.course_name}_S{c.semester}_GR{`${c.course.course_group_no < 10 ? "0" + c.course.course_group_no : c.course_group_no}`}</Link></b>
                                            </div>
                                        </div>
                                    );
                                }) : <HomeLoader />
                            }

                        </div>
                    </div>
                    <div className='d-flex box '>

                        <div className='border my-2 col bg-light '>
                            <div className='bg-info p-2'>
                                <b>My Announcements</b>
                            </div>
                            <div className='p-3'>
                                {
                                    announcement?.length == 0 ? <p>No Announcement</p> :
                                        announcement?.map(a => {
                                            return data2?.map(c => {
                                                if (c.course.course_id == a.course_id)
                                                    return (
                                                        <div>
                                                            <b>{c.course.course_name}_S{c.course.semester}_GR{`${c.course.course_group_no < 10 ? "0" + c.course.course_group_no : c.course.course_group_no}`}</b>
                                                            <p><Link href={'/announcement'}>{a.announcement_subject}</Link></p>
                                                        </div>);
                                            })
                                        })
                                }

                            </div>

                        </div>
                    </div>
                    <Calendar />
                </div>
                <DisscussionList setDisscussion={fetchPost} disscussion={disscussion} course={data2} />
            </div>
       
            
           
            
      </div>
    )
}

export default HomePage