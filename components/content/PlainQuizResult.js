import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ConfirmSmall from "../utils/ConfirmSmall";
import Reject from "../utils/Reject";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import { useClaimContext } from "../Layout";
import UserDataService from "../../data-service/UserDataService";
import { useRouter } from "next/router";
const PlainQuizResult = ({ allAttempt, handleNext, totalQuestion, score, setScore, status, question, isFinish}) => {
    const claims = useClaimContext();
    const number_correct_answer = allAttempt?.filter(a => a.responses.some(r => r.choosen.isCorrect && r.question_id == question.question_id)).length 
    //const [students, setStudent] = useState();
    //const router = useRouter();
    useEffect(() => {
        //const fetchStudentInCourse = async () => {
        //    const student = await UserDataService.getAllStudentByCourse(router.query.course_id)
        //    setStudent(student)
        //}
        //if (!students) {
        //    fetchStudentInCourse();
        //}
        console.log(allAttempt)
        let tempScore = score;
        if (status) {
            if (question.difficulties == "easy") {
                tempScore += (1 / totalQuestion) * 100
            }
            else if (question.difficulties == "medium") {
                tempScore += (2 / totalQuestion) * 100
            }
            else {
                tempScore += (3 / totalQuestion) * 100
            }
            setScore(tempScore)
        }
        
    },[])
    return (
        <div className="bg-white p-4">
            <div className="d-flex mx-auto">
                {status ? <ConfirmSmall /> : <Reject />}
                <b className={`mx-4 ${status?"text-success":"text-danger"} fs-3`}>{status ? "Correct!" : "InCorrect!"}</b>
            </div>
            <b className="fs-5">The correct answer is: {question.options.find(o => o.isCorrect == true).option_text}</b>
            <p>{question.explaination}</p>
            <div>
                <div>
                    <p>Your score</p>
                    <div className="d-flex">
                        <FontAwesomeIcon icon={faStar} />
                        <p className="mx-4">{score || 0} /100</p>
                    </div>
                    <div>
                        <p>{((number_correct_answer || 0) / (allAttempt?.length || 1))*100}% students answers correctly</p>
                        <p>Rank</p>
                    </div>
                </div>
            </div>
            <button disabled={isFinish} onClick={() => handleNext(true)} type="button" className="btn btn-lg btn-success"> Next Question</button>
        </div>
    );
}
export default PlainQuizResult;