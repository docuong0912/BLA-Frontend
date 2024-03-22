const { default: http } = require("./http-common");

const UploadQuiz = async (quiz) => {
    try {
        const res = await http.post(`/quizzes/post-quiz`,quiz);
        return res;
    } catch (err) {
        console.error("Error posting quiz, error: " + err)
    }
}
const UploadContent = async (content) => {
    try {
        const res = await http.post(`/contents/post-content`, content, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return res;
    } catch (err) {
        console.error("Error posting content, error: " + err)
    }
}
const GetContentDetail = async (id) => {
    try {
        const res = await http.get(`/contents/details/${id}`);
        return res;
    } catch (err) {
        console.error("Error getting post details, error: " + err)
    }
}
const GetContentByCourseId = async (course_id) => {
    try {
        const res = await http.get(`/contents/get-content-by-course-id?course_id=${course_id}`);
        return res;
    } catch (err) {
        console.error("Error getting post details, error: " + err)
    }
}
const GetContentByUserId = async (user_id,course_id) => {
    try {
        const res = await http.get(`/contents/get-content-by-user-id?user_id=${user_id}&course_id=${course_id}`);
        return res;
    } catch (err) {
        console.error("Error getting post details, error: " + err)
    }
}
const SubmitQuiz = async (attempt) => {
    try {
        const res = await http.post(`/attempts/submit-quiz-answer`,attempt);
        return res;
    } catch (err) {
        console.error("Error submitting quiz answers, error: " + err)
    }
}
const GetTotalAttempts = async (quizId) => {
    try {
        const res = await http.get(`/attempts/all-attempt-by-quiz-id?quiz_id=${quizId}`);
        return res;
    } catch (err) {
        console.error("Error getting attempt, error: " + err)
    }
}
const CreateAttempt = async (attempt) => {
    try {
        const res = await http.post(`/attempts/submit-quiz-answer`,attempt);
        return res;
    } catch (err) {
        console.error("Error creating attempt, error: " + err)
    }
}
const CreateAnswer = async (response) => {
    try {
        const res = await http.post(`/responses/submit-response`,response);
        return res;
    } catch (err) {
        console.error("Error submit response, error: " + err)
    }
}
const ChangeContentStatus = async (usercontent,id) => {
    try {
        const res = await http.put(`/usercontents/change-user-content-status/${id}`, usercontent);
        return res;
    } catch (err) {
        console.error("Error changing status, error: " + err)
    }
}
const UpdateScoreforQuiz = async (id,score) => {
    try {
        const res = await http.put(`/attempts/update-score/${id}`, score);
        return res;
    } catch (err) {
        console.error("Error changing status, error: " + err)
    }
}
const UpdateQuestion = async (id,question) => {
    try {
        const res = await http.put(`/quiz-questions/change-question-content/${id}?content=${question}`);
        return res;
    } catch (err) {
        console.error("Error updating question,err: " + err);
    }
}
const UpdateOption = async (id, option) => {
    try {
        const res = await http.put(`/quiz-options/change-option-text/${id}?text=${option}`);
        return res;
    } catch (err) {
        console.error("Error updating option,err: " + err);
    }
}
const Grading = async (id, grade) => {
    try {
        const res = await http.put(`/submissions/grading/${id}`,grade);
        return res;
    } catch (err) {
        console.error("Error grading,err: " + err);
    }
}
const GetAssignmentById = async (id) => {
    try {
        const res = await http.get(`/assignments/details/${id}`);
        return res;
    } catch (err) {
        console.error("Error getting assignment by id,err: " + err);
    }
}
const UploadAssignment = async (assignment) => {
    try {
        const res = await http.post(`/assignments/post-new-assignment`, assignment);
        return res;
    } catch (err) {
        console.error("Error posting asignment,err: " + err);
        if (err.response) {
            // The request was made and the server responded with a status code
            console.error("Response data:", err.response.data);
            console.error("Response status:", err.response.status);
            console.error("Response headers:", err.response.headers);
        } else if (err.request) {
            // The request was made but no response was received
            console.error("No response received:", err.request);
        } else {
            // Something happened in setting up the request that triggered the error
            console.error("Error details:", err.message);
        }
    }
}
const GetAllAssignmentByCourseId = async (course_id) => {
    try {
        const res = await http.get(`/assignments/all-by-course-id?course_id=${course_id}`)
        return res;
    } catch (err) {
        console.error("Error getting asignment,err: " + err);
    }
}
const PostFile = async (file) => {
    try {
        const res = await http.post(`/files/upload-file`,file, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return res;
    } catch (err) {
        console.error("Error posting asignment,err: " + err);
    }
}
const UploadSubmission = async (submission) => {
    try {
        const res = await http.post(`/submissions/post-submission`, submission);
        return res;
    } catch (err) {
        console.error("Error posting submission,err: " + err);
        if (err.response) {
            // The request was made and the server responded with a status code
            console.error("Response data:", err.response.data);
            console.error("Response status:", err.response.status);
            console.error("Response headers:", err.response.headers);
        } else if (err.request) {
            // The request was made but no response was received
            console.error("No response received:", err.request);
        } else {
            // Something happened in setting up the request that triggered the error
            console.error("Error details:", err.message);
        }
    }
}
const GetAllSubmission = async () => {
    try {
        const res = await http.get(`/submissions/all`);
        return res;
    } catch (err) {
        console.error("Error fetching submission,err: " + err);
        if (err.response) {
            // The request was made and the server responded with a status code
            console.error("Response data:", err.response.data);
            console.error("Response status:", err.response.status);
            console.error("Response headers:", err.response.headers);
        } else if (err.request) {
            // The request was made but no response was received
            console.error("No response received:", err.request);
        } else {
            // Something happened in setting up the request that triggered the error
            console.error("Error details:", err.message);
        }
    }
}
const GetAllAssignment = async () => {
    try {
        const res = await http.get(`/assignments/all`);
        return res;
    } catch (err) {
        console.error("Error assignment,err: " + err);
        if (err.response) {
            // The request was made and the server responded with a status code
            console.error("Response data:", err.response.data);
            console.error("Response status:", err.response.status);
            console.error("Response headers:", err.response.headers);
        } else if (err.request) {
            // The request was made but no response was received
            console.error("No response received:", err.request);
        } else {
            // Something happened in setting up the request that triggered the error
            console.error("Error details:", err.message);
        }
    }
}
const AssessmentDataService = {
    UploadQuiz,
    UploadContent,
    GetContentDetail,
    SubmitQuiz,
    GetTotalAttempts,
    CreateAttempt,
    CreateAnswer,
    ChangeContentStatus,
    UpdateScoreforQuiz,
    UpdateQuestion,
    UpdateOption,
    GetAssignmentById,
    UploadAssignment,
    GetAllAssignmentByCourseId,
    PostFile,
    UploadSubmission,
    Grading,
    GetAllSubmission,
    GetAllAssignment,
    GetContentByCourseId,
    GetContentByUserId
}
export default AssessmentDataService