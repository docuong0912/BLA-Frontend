import Layout, { useClaimContext } from '@/components/Layout';
import PresessionBlock from '@/components/content/PresessionBlock';
import UserDataService from '../../data-service/UserDataService'
import { useRouter } from 'next/router';
import React, { createContext, useContext, useEffect, useState } from 'react'
import Loader from '@/components/Loader';
import { getMonthName, getWeekDates } from '@/components/utils/ContentDateCreation';
import { toast_success } from '../../components/notify/notify';
import AssessmentDataService from '../../data-service/AssessmentDataService'
const contentContext = createContext();
const Create = () => {
    const router = useRouter();
    const [students, setStudents] = useState();
    const [step,setStep] = useState(1);
    const [content, setContent] = useState([])
    const [sectionCount, setSectionCount] = useState(1);
    const [startDate,setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [question, setQuestion] = useState(Array.from({ length: sectionCount }, () => Array(1).fill([])));
    const [duration, setDuration] = useState([])
    useEffect(() => {
        const date = getWeekDates();
        const startWeekmonth = date.monday.getMonth() + 1;
        const endWeekmonth = date.sunday.getMonth() + 1;
        setStartDate(new Date().getFullYear() + '-' + (startWeekmonth < 10 ? '0' + startWeekmonth : startWeekmonth) + '-' + (date.monday.getDate() < 10 ? '0' + date.monday.getDate() : date.monday.getDate()))
        setEndDate(new Date().getFullYear() + '-' + (endWeekmonth < 10 ? '0' + endWeekmonth : endWeekmonth) + '-' + (date.sunday.getDate() < 10 ? '0' + date.sunday.getDate() : date.sunday.getDate()))

        
    }, []);
    
    useEffect(() => {
        const fetchStudent = async () => {
            const res = await UserDataService.getAllStudentByCourse(router.query.course_id);
            setStudents(res)
        }
        if (students) {
            const UserContents = [];
            students.forEach((s, k) => {
                const temp_content = [...content];
                UserContents.push({ user_id: s.user_id, isFinish: false })

                temp_content[sectionCount - 1] = { ...temp_content[sectionCount - 1], "UserContent": UserContents, "prerequisitecontent_id": temp_content[sectionCount - 1]?.prerequisitecontent_id || [], "cid": sectionCount };

                setContent(temp_content)
            })
        }
        else {
            fetchStudent()
        }
    }, [students, sectionCount]);
    const handleQuiz = async (outerindex, content_id,flatQuestions) => {
        const quizBody = {
            "quiz_title": "Popup quiz",
            "duration": duration[outerindex],
            "content_id": content_id,
            "questions": flatQuestions[outerindex].map(q => {
                return {
                    "quesion_content": q.name,
                    "quesion_type": q.question_type,
                    "options": q.option,
                    "explaination": q.explaination,
                    "difficulties": q.difficult
                };
            })
        }
        const request = await AssessmentDataService.UploadQuiz(quizBody)
    }
    const submitQuiz = async (key,content_id) => {
            const flatQuestions = question.map(q=>q.flat())
        
        if (flatQuestions[key]?.length>0) {

            await handleQuiz(key, content_id, flatQuestions)
                
            }
            
        
    }

    const handleFile=(file,index)=>{
        if(file){
            setContent(UpdateProperty(content,index,"file",file))
        }
        
    }
    const UpdateProperty = (arr, key, propertyName, propertyValue) => {
        
        const temp_content = [...arr];
        temp_content[key] = { ...temp_content[key], [propertyName]: propertyValue };
        return temp_content;
    }

    const handleSubmit= async()=>{
        const flatQuestions = question.map(q=>q.flat());
        console.log(flatQuestions)
        const filterdata = [];
        const sentValues = [];
        const content_has_reference = content.filter(c => c.prerequisitecontent_id.length>0)
        let prerequisite;
        for (const [key, con] of content_has_reference.entries()) {
            filterdata.push(con)
            for (const [prekey, pre] of con.prerequisitecontent_id.entries()) {
                filterdata.push(pre)
                if (!sentValues.find(v => v.cid == pre.cid)) {
                    const main = content.indexOf(pre);
                    prerequisite = await submitForm(pre);
                    await submitQuiz(main, prerequisite.content_id)
                    sentValues.push(pre)
                }
            }
   
            if (!sentValues.find(v => v.cid == con.cid)) {
                const main = content.indexOf(con);
                const data = await submitForm(con, prerequisite.content_id);
                await submitQuiz(main,data.content_id)
                sentValues.push(con, prerequisite.content_id)
            }
           
            
        }
      
          for (let index = 0; index < content.length; index++) {
              if (!filterdata.find(d => d.cid == content[index].cid)) {
                  
                  const data = await submitForm(content[index]);
                  await submitQuiz(index, data.content_id)
            }
        }
        toast_success("Pre-session uploaded successfully");
        router.back();
    }
    const submitForm = async(content,pre_id=null)=>{
        var form = new FormData();
        //content information
        form.append("course_id",router.query.course_id);
            form.append("title",content.title);
        form.append("description", content.description);
        form.append("content_type", router.query.type);
            form.append("start_date",startDate)
            form.append("end_date", endDate);
        //set prerequisite
        form.append("prerequisitecontent_id", pre_id||"")
           
            //set files
        if (content.file) {
            form.append(`files[0].file_name`, content.file.name);
            form.append(`files[0].file_type`, content.file.type.split("/")[0]);
            form.append(`files[0].file_path`, "C:\\Users\\Asus\\Desktop\\thesis project\\bla\\public\\content\\" + content.file.name);
        }
         
            
        //set userContent for each user
        content.UserContent.forEach((s, k) => {
            form.append(`UserContents[${k}].user_id`, s.user_id);
            form.append(`UserContents[${k}].isFinish`, s.isFinish)
            })
            //file uploaded
            form.append("file",content.file)
        const res = await AssessmentDataService.UploadContent(form)
            return res
    }                                                                                                                          
    if(!students) return <Loader/>
  return (
    <div className="container">
    
     <div >
         <div className="" role="document">
             <div>
                 
                 <div>
                     <div >
                         <ul id="smartwizard">
                                  <li className={`${router.query.type == 'presession' ? 'active' : ''}`}><p className='text-white '><b>Pre-session</b></p></li>
                                  <li className={`${router.query.type == 'inclass' ? 'active' : ''}`}><p className='text-white'><b>In class</b></p></li>
                              <li className={`${router.query.type == 'postsession' ?'active':''}`}><p className='text-white'><b>Post session</b></p></li>
                             
                         </ul>
                              <div className="mt-4">
                                  <contentContext.Provider value={content}>
                                      <PresessionBlock setDuration={setDuration} question={question} setQuestion={setQuestion} UpdateProperty={UpdateProperty} setContent={setContent} sectionCount={sectionCount} setSectionCount={setSectionCount} handleSubmit={handleSubmit} content={content} handleFile={handleFile} />
                                  </contentContext.Provider>
                                  
                                
          
                            
                            
                            {/*<button disabled={step==3?false:true} type='button' className='btn btn-lg btn-primary mt-5' onClick={()=>handleSubmit()}>Done</button>*/}
                            
                             
                         </div>
                     </div>
                 </div>
             </div>
         </div>
     </div>
 </div>
  )
}

export default Create;
export const useContentContext = () => useContext(contentContext);
Create.getLayout = page=>{
    return(
        <Layout>
            {page}
        </Layout>
    );
}