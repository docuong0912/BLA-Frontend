import Layout from '@/components/Layout';
import React, { useState,useEffect } from 'react';

import Cookies from 'js-cookie';
;
import Loader from '@/components/Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullhorn } from '@fortawesome/free-solid-svg-icons';
import { useDecodeJwt } from '../../hooks/useDecodeJwt';
import AnnoucementDataService from '../../data-service/AnnouncementDataService';
const Announcement = () => {
    const claims = useDecodeJwt(Cookies.get('jwt'));
    const [announcements, setAnnouncement] = useState();
    useEffect(() => {
        const fetchannouncement = async () => {
            const res = await AnnoucementDataService.getAnnouncementsByUser(claims.user_id);
            setAnnouncement(res);
        }
        if (!announcements) {
            fetchannouncement();
        }
    },[])
    if(!announcements) return <Loader/>
  return (

      <div className="d-flex flex-column justify-content-center align-items-center ">
          <div className="my-3 bg-white p-3 rounded-1 col-8 announcement-container">
              <h3 className="my-3 text-center">Announcements</h3>
             {/* <button className={`btn btn-lg ${claims.role_name == "Lecturer" ? "":"d-none"}`}><p>Create Announcement</p></button>*/}
              {announcements.length == 0 ? <b className="fs-4 d-block m-3">No Announcements</b> :
                  announcements.map(a => {
                      return (
                          <div key={a.announcement_id} className='border-bottom border-2 my-2 bg-light p-4'>
                              <FontAwesomeIcon icon={faBullhorn} className='fs-1' />
                              <div className='d-inline-block mx-5'>
                                  <b className='fs-5'>{a.announcement_subject}</b>
                                  <p>{a.announcement_message}</p>
                              </div>


                          </div>
                      );
                  })
              }
          </div>
          
		
	</div>
    
	
	
	


  )
}

export default Announcement;
Announcement.getLayout = page=>{
    return(
        <Layout>
          
            {page}
          
            
        </Layout>
    );
}