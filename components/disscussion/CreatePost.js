import { faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { useClaimContext, useCourseContext, useSocketContext } from "../Layout";
import UserDataService from "../../data-service/UserDataService";
import PostDataService from "../../data-service/PostDataService";
import AssessmentDataService from "../../data-service/AssessmentDataService";
const CreatePost = ({ setDisscussion }) => {
    const [file, setFile] = useState();
    const claims = useClaimContext();
    const [imageSrc, setImageSrc] = useState();
    const ref = useRef();
    const socket = useSocketContext();
    const [post, setPost] = useState({})
    const course = useCourseContext();
    const [filterCourse, setFilter] = useState([]);
    const [currentCourse, setCurrentCourse] = useState(course[0]?.course.course_id)
    const [userList, setUserList] = useState([]);
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageSrc(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        }
    };
    const fetchUser = async () => {
        const student = await UserDataService.getAllStudentByCourse(currentCourse)
        const lecturer = await UserDataService.getLecturerByCourse(currentCourse);
        student.push(lecturer);
        setUserList(l => [...l, student]);
        setFilter(f => [...f, currentCourse])
    }
    const handleSubmit = async () => {
        const fileformdata = new FormData();
        let fileUpload;
        if (file) {
            fileformdata.append("file_name", file?.name);
            fileformdata.append("file_type", file?.type);
            fileformdata.append("file", file);
            fileUpload = await AssessmentDataService.PostFile(fileformdata);
        }
        

        const index = course.findIndex(c => c.course.course_id == currentCourse)
        
        const postBody = {
            "post_content": post?.post_content,
            "course_id": currentCourse,
            "create_by": claims.role_name+'/'+claims.user_id,
            "file_id": fileUpload?.file_id,
            "user": userList[index]?.map((u, k) => { return { "user_id": (k < userList[index].length-1?"Students/":"Lecturers/")+ u.user_id } })
        }
        
        await PostDataService.CreatePost(postBody);
        socket.emit('postCreated', currentCourse);
        const temp = { ...post };
        temp.post_content = '';
        setPost(temp)
        
    }
    useEffect(() => {
        if (!filterCourse.includes(currentCourse)) {
            fetchUser();
        }
        
    }, [currentCourse])

    return (
        <div>
            <div className="d-flex">
                <Image src={"/avatar/no-avatar.jpg"} width={50} height={50} className='rounded-circle' alt='avatar' />

                <textarea value={post?.post_content} onChange={(e) => setPost(p => {
                    let temp = { ...p };
                    temp = { ...temp, "post_content": e.target.value }
                    setPost(temp)
                })} className="form-control" placeholder="Post new feeds..." />
            </div>
            {imageSrc ? <Image src={imageSrc} width={50} height={50} className='mx-auto rounded-3' alt='avatar' /> :""}
            <div className="d-flex justify-content-between mt-2 ">
                <input onChange={(e) => handleFileChange(e)} ref={ref} type="file" className=" d-none" accept="image/*" /><FontAwesomeIcon onClick={() => ref.current.click()} style={{ color: "blue" }} icon={faImage} />
                <label for="cars">Send to:</label>

                <select onChange={(e) => setCurrentCourse(e.target.value)} name="cars" id="cars">
                    {course?.map(c => {
                        return <option key={c.course.course_id} value={c.course.course_id}>{c.course.course_name}_GR{c.course.course_group_no}</option>
                    }) }
                </select>
                <button onClick={() => handleSubmit()} type="button" className="btn btn-sm btn-warning">Post</button>
            </div>
        </div>
    );
}
export default CreatePost;