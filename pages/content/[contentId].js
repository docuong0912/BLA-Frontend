import Layout, { useClaimContext } from '@/components/Layout'
import Loader from '@/components/Loader';
import ContentSideBar from '@/components/utils/ContentSideBar';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react'
import PopupQuiz from '../../components/content/PopupQuiz';
import TotalResult from '../../components/content/TotalResult';
import PlainQuiz from '../../components/content/PlainQuiz';
import AssessmentDataService from '../../data-service/AssessmentDataService';


const ContentDetail = () => {
    const claims = useClaimContext();
    const router = useRouter();
    const [content, setContent] = useState();
    const [hasDoneQuiz, setQuiz] = useState(false)
    const [prevTime,setPrevTime] = useState(0);
    const [seek,setSeek] = useState(0);
    const [time, setTime] = useState(30);
    const [showQuiz, setShowQuiz] = useState(false)
    const [skipTime, setSkipTime] = useState(0)
    const videoRef = useRef();
    const [result, showResult] = useState(false)
    useEffect(() => {
        const fetchContent = async () => {
            const data = await AssessmentDataService.GetContentDetail(router.query.contentId);
            setContent(data)
        }
        if (!content) {
            fetchContent();
        }
    },[content])
    //useEffect(()=>{
       
    //    const countdown = setTimeout(()=>{
    //        setTime(time=>time-1);
    //    },1000)
    //    if(time<=0){
    //        setTime(0)
    //    }
    //    return ()=>clearTimeout(countdown);
    //}, [time])

    const SkipDetection = (time) => {
        if (claims.role_name == "Lecturer") return;
        handleTimeUpdate(time);
        
        const userContent = content.userContents.find((uc) => uc.user_id == claims.user_id);
        if(userContent.isFinish) return;
        const maxtime = 1;
        const maxseek = 1;
        if (time - prevTime > maxtime && seek > maxseek) {
            setSkipTime(skip=>skip+1)
            alert("you are skipping video")
            videoRef.current.currentTime = prevTime
            setSeek(0)
        }

        setPrevTime(time)

    }
    const handleTimeUpdate = (currentTime) => {
        if (currentTime >= content.quizzes?.duration) {
            if (!hasDoneQuiz && !content.quizzes.attempts?.find(a => a.user_id.slice(-1) == claims.user_id)) {
                videoRef.current.pause();
                setShowQuiz(true);
            }
        }
        
    }
    const handleFinish = async () => {
        if (claims.role_name == "Lecturer") return;
        showResult(true)
        const userContent = content.userContents.find((uc) => uc.user_id == claims.user_id);
        if (userContent.isFinish) return;
        userContent.isFinish = true
        const res = await AssessmentDataService.ChangeContentStatus(userContent, userContent.id)
    }
    if(!content) return <Loader/>
  return (
      <div className='p-5 position-relative'>
          {result ? <TotalResult skipTime={skipTime} content={content} showResult={showResult} /> : ""}
          {showQuiz ? <PopupQuiz quizzes={content.quizzes} setQuiz={setQuiz} setShowQuiz={setShowQuiz} /> : ""}
        <h1>{content.title}</h1>
          
          <div className="bg-white col-8 rounded-1 p-3 my-2">
              <b>Lecture Description:</b>
              <p>{content.description}</p>
          </div>
          {!content.files[0] ?
              <PlainQuiz handleFinish={handleFinish} quizzes={content.quizzes} />
              : ""}
        {content.files[0]?.file_type == 'video'
        ?
        <video ref={videoRef} onEnded={()=>handleFinish()} width="70%" height="500" controls set="true" onSeeking={()=>setSeek(s=>s+1)} onTimeUpdate={e=>SkipDetection(e.currentTarget.currentTime)}> 
            <source src={`/content/${content.files[0]?.file_name}`} type='video/mp4'/>
        </video>
        :
              content.files[0]?.file_type == 'application' && (
                  <embed
                      src={`/content/${content.files[0]?.file_name}`}
                      type='application/pdf'  // Specify the correct MIME type for PDF files
                      frameBorder="0"
                      scrolling="auto"
                      height="1000px"
                      width="80%"
                  />)
        }
        
        <button className={`btn btn-large d-block btn-success p-4 mt-3 ${content.files[0]?.file_type != 'application'?'d-none':""}`} onClick={()=>handleFinish()}>Finish Reading</button>
    </div>
  )
}

export default ContentDetail
ContentDetail.getLayout= page=>{
    return(
        <Layout>
         
                
                <ContentSideBar />
                {page}
            
           
            
            
        </Layout>
    )
    
}