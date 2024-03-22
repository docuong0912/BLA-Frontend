import {toast} from "react-toastify"
import AnnouncementToast from "./AnnouncementToast"
export const assignment_notify=()=>{
    toast.success("Assignment created sucessfully",{
        position: toast.POSITION.TOP_RIGHT,
    
      })
}
export const toast_success = (message) => {
    toast.success(message, {
        position: toast.POSITION.TOP_RIGHT,
    })
}
export const notification_nofiy=(title,desciption,course)=>{
    toast(<AnnouncementToast title={title} description= {desciption} courseId={course}/>,{
        progress:undefined,
        draggable:true,
        hideProgressBar:true
    })
}
