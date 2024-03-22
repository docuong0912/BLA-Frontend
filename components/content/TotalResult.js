import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Legend, Title } from 'chart.js'
import Loader from "../Loader";
import { useClaimContext } from "../Layout";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ConfirmSmall from "../utils/ConfirmSmall";
import Link from "next/link";
import AssessmentDataService from "../../data-service/AssessmentDataService";
Chart.register(ArcElement);
Chart.register(Legend);
Chart.register(Title)
const TotalResult = ({ attempts=null, skipTime = null ,question}) => {
    
    const claims = useClaimContext();
    const router = useRouter();
    const [content, setContent] = useState()
    useEffect(() => {
        const fetchContent = async () => {
            const res = await AssessmentDataService.GetContentByUserId(claims.user_id, router.query.course_id);
            setContent(res)
        }
        if (!content) {
            fetchContent();
        }
    },[])

    return (
        <div style={{ zIndex: 99 }} className=" position-fixed w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-75 top-0 start-0">
            <div className="bg-white p-3 col-8 rounded-3 overflow-scroll h-75">
                <h1 className="text-info text-center">Total Result</h1>
                <div className="d-flex">
                    <div style={{ width: "300px", height: "300px" }}>
                        <Doughnut
                            data={{
                                labels: [
                                    
                                    "Correct Answer",
                                    "Total Question"
                                ],
                                datasets: [
                                    {
                                        label: "Population (millions)",
                                        backgroundColor: [
                                            "green",
                                            "lightblue"
                                            

                                        ],
                                        /*total - incorrect,total - correct*/
                                        data: [
                                            attempts?.responses.length - attempts?.responses.filter(a => a.choosen.isCorrect != true).length,
                                            attempts?.responses.length - attempts?.responses.filter(a => a.choosen.isCorrect == true).length
                                            
                                        ]
                                    }
                                ]
                            }}
                            option={{
                                plugins: {
                                    title: {
                                        display: true,
                                        text: "Predicted world population (millions) in 2050"
                                    },
                                    legend: {
                                        display: true
                                    }
                                }


                            }}
                        />

                    </div>
                    <div className="flex-fill bg-light p-3">
                        <p className="text-info">Total of question : {attempts?.responses.length} </p>
                        <p className="text-success">Total Correct answers : {attempts?.responses.filter(a => a.choosen.isCorrect == true).length} </p>
                        <p className="text-danger">{skipTime ? `Skip time: ${skipTime}` : ""} </p>
                        <div>
                            {content?.filter(c => c.prerequisitecontent_id == router.query.contentId).map(pre => {
                                return (
                                    <div className="d-flex justify-content-between align-items-center">
                                        <Link onClick={() => showResult(false)} href={`${router.asPath.replace(router.contentId), pre.content_id}?course_id=${router.query.course_id}`}>{pre.title} unlocked</Link>
                                        <ConfirmSmall />
                                    </div>
                                    
                                );
                            })}
                            
                        </div>
                        <div>
                            <b>Review:</b>
                            <div>
                                {
                                    attempts?.responses.filter(r => r.choosen.isCorrect != true).map((r,k) => {
                                        return (
                                            <div>
                                                <b>{k + 1}.{question?.find(q => q.question_id == r.question_id).quesion_content}</b>
                                                <p className="text-danger">Your answer was: {r.choosen.option_text}</p>
                                                <p className="text-success">Correct answer is: {question?.find(q => q.question_id == r.question_id).options.find(o => o.isCorrect == true).option_text}</p>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <button type="button" className="btn btn-lg mx-auto bg-success text-white" onClick={() => router.back()}>Next</button>

            </div>
        </div>
    );
}
export default TotalResult