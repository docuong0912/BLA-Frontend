import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from "next/navigation";
import Link from "next/link";
const AnnouncementBox = ({ announcement, course, openAnnounceBox, setOpen }) => {
    const router = useRouter();
    return (
        <div className={`position-absolute bg-white rounded-3 announcement-box-container ${openAnnounceBox ? "" : "d-none"}`}>
            <FontAwesomeIcon onClick={() => setOpen(false)} className='position-absolute top-0 end-0 m-3' icon={faX} />

            {
                announcement?.length != 0 ?
                announcement?.map(a => {
                    return (
                        <div className="m-4">
                            <b>{course?.find(c => c.course.course_id == a.course_id)?.course_name}</b>
                            <Link href={a.link_to}><p>{a.announcement_subject}</p></Link> 
                    </div>
                );
                })
                    :
                    <p className="text-center m-5">No Announcements</p>
            }
            <button onClick={() => { router.push('/announcement?tab=2'); setOpen(false) }} className="btn btn-lg btn-light position-sticky top-50 " type="button"><p className="text-info " style={{ fontSize: "small" }}>View Announcements</p></button>
        </div>
    );
}
export default AnnouncementBox;