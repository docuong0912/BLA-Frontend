
const { default: http } = require("./http-common");

const getAnnouncementsByUser = async (user_id) => {
    
    try {
        const res = await http.get(`/announcement/fromUser?user_id=${user_id}`);
        return res;
    } catch (err) {
        console.error("Error fetching announcement by users, error: " + err)
    }
}
const PostAnnouncement = async (annnouncement) => {

    try {


        const res = await http.post(`/announcement/post-new-announcement`, annnouncement);
        return res;
    } catch (err) {
        console.error("Error posting new announcement, error: " + err);
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
const AnnoucementDataService = {
    getAnnouncementsByUser,
    PostAnnouncement
}
export default AnnoucementDataService;