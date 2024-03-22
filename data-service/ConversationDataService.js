import http from "./http-common";
const GetAllChat = async (user_id) => {
    try {
        const res = await http.get(`/chats/get-all-chat-by-user?user_id=${user_id}`);
        return res;
    } catch (err) {
        console.error("Error fetching chats,err: " + err);
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
const GetChatDetails = async (chat_id) => {
    try {
        const res = await http.get(`/chats/details/${chat_id}`);
        return res;
    } catch (err) {
        console.error("Error getting chat detail,err: " + err);
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
const StartNewChat = async (chat) => {
    try {
        const res = await http.post(`/chats/start-new-chat`,chat);
        return res;
    } catch (err) {
        console.error("Error starting new chat,err: " + err);
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
const SendMessage = async (message) => {
    try {
        const res = await http.post(`/chat-lines/post-new-message`, message);
        return res;
    } catch (err) {
        console.error("Error sending message,err: " + err);
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
const ChangeReadStatus = async (chat_id,user_id) => {
    try {
        const res = await http.put(`/chats/change-status/${chat_id}?user_id=${user_id}`);
        return res;
    } catch (err) {
        console.error("Error update read status,err: " + err);
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
const ConversationDataService = {
    GetAllChat,
    GetChatDetails,
    StartNewChat,
    SendMessage,
    ChangeReadStatus
}
export default ConversationDataService;