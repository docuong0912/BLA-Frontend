import { useEffect, useState } from "react";
import { useClaimContext } from "../Layout";
import QuizResult from "./QuizResult";
const PopupQuiz = ({ quizzes,setShowQuiz,setQuiz }) => {
    const claims = useClaimContext();
    const [responses, setResponses] = useState([]);
    const [index, setIndex] = useState(0)
    const [result, showResult] = useState(false);
    const [Err,setErr] = useState([])
    useEffect(() => {
        console.log(responses)
    },[responses])
    const submitAnswer = async (key) => {
        
        const request = await fetch(`https://localhost:7134/api/QuizAttempts`, {
            method: 'POST',
            body: JSON.stringify({
                "user_id": claims.role_name + "/" + claims.user_id,
                "quiz_id": quizzes.quiz_id,
                "responses": responses[index]
            }),
            headers: {
                'Content-type': 'application/json'
            }
        })
        if (request.status >= 200 && request.status<300) {
            if (quizzes.questions.length - 1 == key) {
                setShowQuiz(false);
                setQuiz(true);
            }
            else {

                showResult(false)
            }
            const temp = [...Err]
            temp[index] = ""
            setErr(temp);
            setIndex(i => i + 1)
        }
        else {
            const temp = [...Err]
            temp[index] = "Something wrong happened"
            setErr(temp)
        }
        
        const data = await request.json();
        console.log(data)
    }
    return (
        <div style={{ zIndex: 99 }} className="position-fixed w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-75 top-0 start-0">
            <div className="bg-white p-3 col-5 rounded-3">
                
                
                    
                    
                        

                            <div >
                                <h5 className="text-center">{quizzes.quiz_title}</h5>
                                <div className="d-flex flex-column justify-content-between align-items-center">
                                    <p>Quesion {index + 1}/{quizzes.questions.length}</p>
                                    <div className="progress w-50">
                            <div style={{ width: `${Math.round((index + 1) /quizzes.questions.length  * 100)}%` }} className="progress-bar progress-bar-striped progress-bar-animated " role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" ></div>
                                    </div>
                                </div>
                    {
                        responses?.length != 0 && result ? <QuizResult Err={Err} index={index} submitAnswer={submitAnswer} status={quizzes.questions[index].options.find(o => o.option_id == responses[index].choosenoption_id)?.isCorrect} explain={quizzes.questions[index].explaination} /> :
                                        <div className="d-flex flex-column justify-content-between align-items-center col my-2">
                                            <b className="fs-5">{quizzes.questions[index].quesion_content}</b>
                                            <div className="d-flex flex-column justify-content-between align-items-center w-75">
                                                {
                                                    quizzes.questions[index].options.map((o, i) => {
                                                        return (
                                                            <div onClick={() => {
                                                                setResponses(r => {
                                                                    const temp = [...r];
                                                                    temp[index] = {
                                                                        "question_id": o.question_id,
                                                                        "choosenoption_id": o.option_id
                                                                    };
                                                                    return temp;
                                                                });
                                                                showResult(true)
                                                            }} key={i} style={{ background: responses.find(r => r.choosenoption_id == o.option_id) ? "DarkBlue" : "Blue" }} className="rounded text-white d-flex justify-content-between align-items-center my-1 p-2 w-100">
                                                                <div className="border border-white rounded-circle border-3 d-flex justify-content-center align-items-center col-2">
                                                                    <p className="mt-2">{i == 0 ? "A" : i == 1 ? "B" : i == 2 ? "C" : "D"}</p>
                                                                </div>
                                                                <p style={{ fontSize: "small" }} className="flex-fill text-center mt-1">{o.option_text}</p>
                                                            </div>
                                                        );
                                                    })
                                                }


                                            </div>


                                           
                                        </div>
                                }
                                

                            </div>

                       
                    
                
            </div>
        
        </div>
            );
        
}
export default PopupQuiz;