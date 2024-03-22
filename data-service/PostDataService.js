import http from "./http-common";

const ViewAllPost = async () => {
    try {
        const res = await http.get(`/post/get-all-posts`);
        return res;
    } catch (err) {
        console.error("Error fetching Posts, error: " + err)
    }
}
const PostComment = async (comment) => {
    try {
        const res = await http.post(`/comment/post-new-comment`,comment);
        return res;
    } catch (err) {
        console.error("Error comment, error: " + err)
    }
}
const UpdateVote = async(vote,id) => {
    try {
        const res = await http.put(`/votes/change-vote/${id}`, vote);
        return res;
    } catch (err) {
        console.error("Error fetching updating vote, error: " + err);

    }
}
const UploadNewVote = async vote => {
    try {
        const res = await http.post(`/votes/new-vote`,  vote );

        return res;
    } catch (err) {
        console.error("Error fetching upload new vote, error: " + err)
    }
}
const CreatePost = async (post) => {
    try {
        const res = await http.post(`/post/upload-post`, post);

        return res;
    } catch (err) {
        console.error("Error fetching upload new post, error: " + err);
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
const PostDataService = {
    ViewAllPost,
    UpdateVote,
    UploadNewVote, PostComment,
    CreatePost
}
export default PostDataService;