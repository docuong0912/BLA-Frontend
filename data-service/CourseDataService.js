const { default: http } = require("./http-common")

const getAllCourse = async (user_id) => {
    try {
        const res = await http.get(`/course/get-course-by-user-id?id=${user_id}`)
        return res;
    } catch (err) {
        console.error("Error fetching all course with user id, error: "+err)
    }
    
    
}
const getCourseById = async (id) => {
    try {
        const res = await http.get(`/course/details/${id}`)
        return res;
    } catch (err) {
        console.error("Error fetching course with id, error: " + err)
    }


}
const CourseDataService = {
    getAllCourse,
    getCourseById
}
export default CourseDataService;