import Image from 'next/image'
import React, { useContext, useState } from 'react'
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Loader from './Loader';
import { createContext } from 'react';
import { getToken, removeToken } from './auth/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SideNavBar from './SideNavBar';
import { tokenExpired, useDecodeJwt } from '../hooks/useDecodeJwt';
import AnnoucementDataService from '../data-service/AnnouncementDataService';
import UserDataService from '../data-service/UserDataService';
import CourseDataService from '../data-service/CourseDataService';
import { io } from 'socket.io-client';
import AnnouncementToast from './notify/AnnouncementToast';
const ClaimContext = createContext();
const AnnouncementContext = createContext();
const CourseContext = createContext();
const SocketContext = createContext();
const Layout = ({children}) => {

    const router = useRouter();
    const [claims, setClaim] = useState();
    const [course, setCourse] = useState();
    const token = getToken();
    const [announcement, setAnnouncement] = useState();
    const [user, setUser] = useState();
    const [socket, setSocket] = useState();
    const [join,setJoin] = useState(false)
    useEffect(()=>{
       
        if (token) {
            setClaim(useDecodeJwt(token));
            if (tokenExpired(token)) {
                removeToken();
            }
        }
       
    }, [])
    useEffect(() => {
        socket?.on('fetchAnnouncement', (announcement,course) => {
            console.log("assignment received")
            toast(<AnnouncementToast title={announcement.announcement_subject} description={announcement.announcement_message} courseId={course} />, {
                progress: undefined,
                draggable: true,
                hideProgressBar: true
            })
           
        })
    }, [socket])
    useEffect(() => {
        const newSocket = io('http://localhost:3001/announcement');
        setSocket(newSocket);

        return () => {
            // Clean up socket connection when component unmounts
            newSocket.disconnect();
        };
    }, [])
    
    useEffect(() => {
        const fetchAnnouncement = async (id) => {
            const res = await AnnoucementDataService.getAnnouncementsByUser(id)

            setAnnouncement(res)
        }
        const fetchUser = async () => {
            const user = claims.role_name == "Lecturer" ? await UserDataService.getLecturerInfo(claims.user_id) : await UserDataService.getStudentInfo(claims.user_id);
            setUser(user)
        }
        const fetchCourse = async () => {
            const course = await CourseDataService.getAllCourse(claims?.user_id);
            setCourse(course)
        }

        if (!announcement && claims) {
            fetchAnnouncement(claims?.user_id)
        }
        if (!user && claims) {
            fetchUser();
        }
        if (!course && claims) {
            fetchCourse();
        }
        


    }, [claims, user, announcement, course]);
    useEffect(() => {
        if (course && !join) {
            socket?.emit('join_course', course);
            setJoin(true)
        };
    },[course])
    const handleLogout = ()=>{
        removeToken();
        router.push('/login')
    }
    
    if (!user || !course) return <Loader />
  return (
    <div>
          <ToastContainer />
          <ClaimContext.Provider value={claims}>
        <header>
              
            <div className='bg w-100 h-100'></div>
                  <b className='fs-1 ms-5 text-white' onClick={() => router.push('/home')}>BLA</b>
                  <SideNavBar user={user} announcement={announcement} />
            <div className='w-25 p-1 d-flex justify-content-evenly align-items-center'>
                <div className='' >
                    <Image src={"/avatar/no-avatar.jpg"} width={50} height={50} className='rounded-circle' alt='avatar'/>
                </div>
                <b>{user?.name}</b>
                <FontAwesomeIcon icon = {faRightFromBracket} onClick={()=>handleLogout()}/>
            </div>
            
          </header>

              <SocketContext.Provider value={socket}>
                  <CourseContext.Provider value={course}>
                      <AnnouncementContext.Provider value={announcement}>
                          <main className='bg-secondary bg-opacity-10 main-layout'>{children}</main>
                      </AnnouncementContext.Provider>
                  </CourseContext.Provider>
              </SocketContext.Provider>
       
      </ClaimContext.Provider>
        
    </div>
  )
}

export default Layout;
export const useClaimContext = () => useContext(ClaimContext);
export const useAnnouncementContext = () => useContext(AnnouncementContext);
export const useCourseContext = () => useContext(CourseContext);
export const useSocketContext = () => useContext(SocketContext);