import { useEffect, useRef, useState } from "react";
import PlainQuizResult from "./PlainQuizResult";
import AssessmentDataService from "../../data-service/AssessmentDataService";
import { useClaimContext } from "../Layout";
import TotalResult from "./TotalResult";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";


const PlainQuiz = ({handleFinish, quizzes }) => {
    const [score, setScore] = useState(0)
    const claims = useClaimContext();
    const easyQuiz = quizzes.questions.filter(q => q.difficulties == "easy").length;
    const medQuiz = quizzes.questions.filter(q => q.difficulties == "medium").length;
    const hardQuiz = quizzes.questions.filter(q => q.difficulties == "hard").length;
    const [attempt, setAttempt] = useState();
    const totalPortion = easyQuiz + medQuiz + hardQuiz;
    const [index, setIndex] = useState(0);
    const [optionIndex, setOptionIndex] = useState();
    const [currentPortion, setCurrentPortion] = useState(quizzes.questions[0].difficulties == "easy" ? 1 : quizzes.questions[0].difficulties == "medium" ? 2 : 3);
    const [prevPortion, setPrevPortion] = useState(0);
    const [result, showResult] = useState(false)
    const [showTotalResult, setTotalResult] = useState(false);
    const [allAttempt, setAllAttempt] = useState();
    const [updateMode, isUpdateMode] = useState("")
    const questionRef = useRef()
    const optionRef = useRef([])
    const [question, setQuestion] = useState()
    const [options, setOption] = useState(quizzes.questions[index].options)
    const handleClick = async (opindex,choosen) => {

        if (result || claims.role_name=="Lecturer") return;
        if (index == quizzes.questions.length - 1) {
            setTotalResult(true)
            handleFinish();
        }
        else {
            setOptionIndex(opindex);
            showResult(true);
        }
        
        
       
       
        
        
        
        const responseBody = {
            "attempt_id": attempt.attempt_id,
            "question_id": quizzes.questions[index].question_id,
            "choosenoption_id": quizzes.questions[index].options[opindex].option_id
        }
        
        const answer = await AssessmentDataService.CreateAnswer(responseBody)
        await AssessmentDataService.UpdateScoreforQuiz(attempt.attempt_id, score)
        const temp = { ...attempt };
        answer.choosen = choosen;
        temp.responses.push(answer)
        setAttempt(temp)

    }
    const handleNext = (next) => {
        if (next) {
            setPrevPortion(p => ((currentPortion / totalPortion) * 100) + p);
            setCurrentPortion(quizzes.questions[index].difficulties == "easy" ? 1 : quizzes.questions[index].difficulties == "medium" ? 2 : 3);
            setIndex(i => i + 1);
        }
        else {
            setPrevPortion(p => ((currentPortion / totalPortion) * 100) - p);
            setCurrentPortion(quizzes.questions[index].difficulties == "easy" ? 1 : quizzes.questions[index].difficulties == "medium" ? 2 : 3);
            setIndex(i => i - 1);
        }
        showResult(false)
    }
    useEffect(() => {
        setOption(quizzes.questions[index].options)
        console.log(quizzes.questions[index])
    },[index])
    useEffect(() => {

        const fetchAttempt = async () => {
            const attempt = await AssessmentDataService.GetTotalAttempts(quizzes.quiz_id);
            setAllAttempt(attempt)
            const availableAttempt = attempt.find(a => a.user_id.slice(-1) == claims.user_id)
            if (availableAttempt) {
                setAttempt(availableAttempt);
                if (availableAttempt.responses.length > 0) {
                    const currentQuestion = quizzes.questions.find(q => q.question_id == availableAttempt.responses[availableAttempt.responses.length - 1].question_id);
                    const currentIndex = quizzes.questions.indexOf(currentQuestion) + 1;
                    setIndex(currentIndex)
                    const currentPortion = quizzes.questions[currentIndex]?.difficulties == "easy" ? 1 : quizzes.questions[currentIndex]?.difficulties == "medium" ? 2 : 3
                    setCurrentPortion(currentPortion);
                    let tempPrev = 0
                    for (let i = 0; i < currentIndex; i++) {

                        tempPrev += quizzes.questions[i].difficulties == "easy" ? 1 : quizzes.questions[i].difficulties == "medium" ? 2 : 3
                    }
                    setPrevPortion((tempPrev / totalPortion) * 100);
                    setScore(availableAttempt.score);
                    setOption(quizzes.questions[currentIndex].options)
                }

            }
            else {
                CreateAttempt();

            }

        }
        const CreateAttempt = async () => {

            const attemptBody = {
                "user_id": claims.role_name + "/" + claims.user_id,
                "quiz_id": quizzes.quiz_id
            }
            const res = await AssessmentDataService.CreateAttempt(attemptBody)
            res.responses = [];
            setAttempt(res)
            setScore(res.score)
        }
        if (!attempt && claims.role_name !="Lecturer") {
            fetchAttempt();
        }


    }, []);
    const updateQuestion = async (question) => {
        const questions = await AssessmentDataService.UpdateQuestion(question.question_id, questionRef.current.value);
        setQuestion(questions)
        isUpdateMode('')
    }
    const updateOption = async (option, key) => {
        const optionTemp = await AssessmentDataService.UpdateOption(option.option_id, optionRef.current[key].value)
        const tempOptionArray = [...options]
        tempOptionArray[key] = optionTemp;
        setOption(tempOptionArray)
        isUpdateMode('')
    }
    if (index > quizzes.questions.length - 1) return <TotalResult allAttempt={allAttempt} attempts={attempt} question={quizzes.questions} />
    return (
        <div className="m-3">
            <div className="progress w-75 ">
                <div style={{ width: `${((currentPortion / totalPortion) * 100) + prevPortion}%` }} className="progress-bar progress-bar-striped progress-bar-animated " role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" ></div>
            </div>
            <div className="w-75 my-4 position-relative">
                {claims.role_name == "Lecturer" ?
                    <div className="d-flex justify-content-end align-items-center">
                           <FontAwesomeIcon icon={faPen} onClick={() => isUpdateMode(q => q == 'question' ? '' : 'question')} className="mx-4 my-2" />
                           <FontAwesomeIcon icon={faTrash} />
                    </div>
                : ""}
               
                
                <div className="rounded-3 border border-5 col mx-auto p-4 border-white bg-light">
                    
                    {updateMode == 'question' ?
                        <div>
                            <textarea ref={questionRef} placeholder={quizzes.questions[index].quesion_content} className="form-control p-3" type="text" />
                            <button onClick={() => updateQuestion(quizzes.questions[index])} className="btn btn-sm btn-light rounded-1 m-1" type="button">Confirm</button>
                        </div>
                         : 
                        <b className="fs-5">{question || quizzes.questions[index].quesion_content} ?</b>}
                </div>
                <div className="mt-2">
                    <div className="d-flex flex-column col ">
                        
                        <div className="d-flex flex-fill">
                            <div onClick={() => handleClick(0, quizzes.questions[index].options[0])} className="position-relative p-3 bg-danger m-1 d-flex justify-content-center align-items-center flex-fill flex-wrap col-5">
                                {claims.role_name == "Lecturer" ? <FontAwesomeIcon onClick={() => isUpdateMode(m => m == 'option1' ? '' : 'option1')} icon={faPen} className="position-absolute end-0 top-0 m-2" /> : ""}
                                {updateMode == "option1" ?
                                    <div className="col">
                                        <input ref={e => optionRef.current[0] = e} placeholder={quizzes.questions[index].options[0].option_text} className="form-control" type="text" />
                                        <button onClick={() => updateOption(quizzes.questions[index].options[0],0)} className="btn btn-sm btn-light rounded-1 m-1" type="button">Confirm</button>
                                    </div> :
                                    <p className="text-white">A. {options[0].option_text || quizzes.questions[index].options[0].option_text}</p> 
                                    
                                    
                            } 
                                
                            </div>
                            <div onClick={() => handleClick(1, quizzes.questions[index].options[1])} className="position-relative p-3 bg-primary m-1 d-flex justify-content-center align-items-center flex-fill flex-wrap col-5">
                                {claims.role_name == "Lecturer" ? <FontAwesomeIcon onClick={() => isUpdateMode(m => m == 'option2' ? '' : 'option2')} icon={faPen} className="position-absolute end-0 top-0 m-2" /> : ""}
                                {updateMode != 'option2' ?
                                    <p className="text-white">B. {options[1].option_text ||quizzes.questions[index].options[1].option_text}</p> :
                                    <div className="col">
                                        <input ref={e => optionRef.current[1] = e} placeholder={quizzes.questions[index].options[1].option_text} className="form-control" type="text" />
                                        <button onClick={() => updateOption(quizzes.questions[index].options[1],1)} className="btn btn-sm btn-light rounded-1 m-1" type="button">Confirm</button>
                                    </div>
                                }
                            </div>
                        </div>
                        {options.length > 2 ?
                            <div className="d-flex flex-fill">
                                <div onClick={() => handleClick(2, quizzes.questions[index].options[2])} className="position-relative p-3 bg-success m-1 d-flex justify-content-center align-items-center flex-fill col-5">
                                    {claims.role_name == "Lecturer" ? <FontAwesomeIcon onClick={() => isUpdateMode(m => m == 'option3' ? '' : 'option3')} icon={faPen} className="position-absolute end-0 top-0 m-2" /> : ""}
                                    {updateMode != 'option3' ?
                                        <p className="text-white">C. {options[2]?.option_text ||quizzes.questions[index].options[2].option_text}</p> :
                                        <div className="col">
                                            <input ref={e => optionRef.current[2] = e} placeholder={quizzes.questions[index].options[2].option_text} className="form-control" type="text" />
                                            <button onClick={() => updateOption(quizzes.questions[index].options[2],2)} className="btn btn-sm btn-light rounded-1 m-1" type="button">Confirm</button>
                                        </div>}
                                </div>
                                {quizzes.questions[index].options.length > 3 ?
                                    <div onClick={() => handleClick(3, quizzes.questions[index].options[3])} className="position-relative p-3 bg-warning m-1 d-flex justify-content-center align-items-center flex-fill col-5">
                                        {claims.role_name == "Lecturer" ? <FontAwesomeIcon onClick={() => isUpdateMode(m => m == 'option4' ? '' : 'option4')} icon={faPen} className="position-absolute end-0 top-0 m-2" /> : ""}
                                        {updateMode != 'option4' ?
                                            <p className="text-white">D. {options[3]?.option_text ||quizzes.questions[index].options[3].option_text}</p> :
                                            <div className="col">
                                                <input ref={e => optionRef.current[3] = e} placeholder={quizzes.questions[index].options[3].option_text} className="form-control" type="text" />
                                                <button onClick={() => updateOption(quizzes.questions[index].options[3],3)} className="btn btn-sm btn-light rounded-1 m-1" type="button">Confirm</button>
                                            </div>}
                                    </div>
                                    : ""
                                }
                                
                            </div>
                            : ""}
                       
                    </div>
                </div>
                {claims.role_name == "Lecturer" ?
                <div>
                        <button onClick={() => handleNext(true)} type="button" className="btn btn-lg btn-light">Next Question</button>
                        <button onClick={() => handleNext(false)} type="button" className="btn btn-lg btn-light">Previous Question</button>
                </div>
                    
                    : ""}
            </div>
            {result || claims.role_name == "Lecturer" ? <PlainQuizResult allAttempt={allAttempt} handleNext={handleNext} isFinish={index == quizzes.questions.length - 1} totalQuestion={quizzes.questions.length} score={score} setScore={setScore} status={quizzes.questions[index].options[optionIndex]?.isCorrect} question={quizzes.questions[index]} /> : ""}
            {showTotalResult ? <TotalResult allAttempt={allAttempt} attempts={attempt} question={quizzes.questions} /> : ""}
 
 
        </div>
    );
}
export default PlainQuiz;