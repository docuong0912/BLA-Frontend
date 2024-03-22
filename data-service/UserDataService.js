import http from "./http-common";


const getStudentInfo = async (id) => {
    
    try {
        const res = await http.get(`/students/details/${id}`);
        return res;
    } catch (err) {
        console.error("Error fetching student by id, error: " + err)
    }
}
const getLecturerInfo = async (id) => {

    try {
        const res = await http.get(`/lecturers/details/${id}`);
        return res;
    } catch (err) {
        console.error("Error fetching lecturer by id, error: " + err)
    }
}
const getAllStudentByCourse = async (course_id) => {
    try {
        const res = await http.get(`/students/get-students-by-course?course_id=${course_id}`);
        return res;
    } catch (err) {
        console.error("Error fetching lecturer by id, error: " + err)
    }
}
const getLecturerByCourse = async (course_id) => {
    try {
        const res = await http.get(`/users/lecturer-by-course?course_id=${course_id}`);
        return res;
    } catch (err) {
        console.error("Error fetching lecturer by id, error: " + err)
    }
}
const UserDataService = {
    getStudentInfo,
    getLecturerInfo,
    getAllStudentByCourse,
    getLecturerByCourse
}
export default UserDataService