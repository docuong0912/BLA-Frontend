import Confirm from "../utils/Confirm";
import Reject from "../utils/Reject";

const QuizResult = ({Err, status, explain, submitAnswer,index }) => {
    return (
        <div className="postion-absolute top-100 start-50">
            
            {status ? <Confirm /> : <Reject/>}
            <h1 className={`${status ?"text-success":"text-danger"} text-center`}>{status ? "Correct" : "Incorrect"} !</h1>
            <p className="my-4">Explain: {explain}</p>
            <button type="button" onClick={() => submitAnswer(index)} className=" btn btn-lg btn-success mt-3">Next</button>
            {Err ?
                <div className="d-inline-block mx-5">
                    <p className="text-danger">{Err}</p>
                </div>
                : ""}
        </div>
    );
}
export default QuizResult;