import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck,faLock } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'
import { useClaimContext } from '../Layout';
import AssessmentDataService from '../../data-service/AssessmentDataService';
const ContentSideBar = () => {
    const claims = useClaimContext();
    const router = useRouter();
    const [content, setContent] = useState();
    useEffect(() => {
        
        const fetchContent = async () => {
            const content = claims.role_name == "Lecturer" ? await AssessmentDataService.GetContentByCourseId(router.query.course_id) : await AssessmentDataService.GetContentByUserId(claims.user_id, router.query.course_id);
            setContent(content)
        }
        if (!content) {
            fetchContent();
        }
    }, [])
  return (
        
        <div className='content-sidebar-container'>
            <h3>Presession</h3>
            <div>
                {content?.map((c,k)=>{
                    if(c.content_type=="presession"){
                        const userContent = c.userContents.find((uc) => uc.user_id == claims.user_id);
                        const preUserContent = c.prerequisite?.userContents.find((uc) => uc.user_id == claims.user_id); 
                        return(
                            <button disabled={!preUserContent?.isFinish} onClick={()=>router.push(`/content/${c.content_id}?course_id=${c.course_id}`)}>
                                <b>{k+1}.{c.title}</b>
                                {userContent && userContent.isFinish?<FontAwesomeIcon icon={faCircleCheck} style={{color:"#24d600"}}/>:<FontAwesomeIcon icon={faLock} />}
                                
                            </button>
                            );
                    }
                    
                })}
                
            </div>
        </div>
        
    
  )
}

export default ContentSideBar