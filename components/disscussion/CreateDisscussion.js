import { useRouter } from 'next/router';

import React, { useState } from 'react'
import { useClaimContext } from '../Layout';

const CreateDisscussion = () => {
    const router = useRouter();
    const claims = useClaimContext();
    const [file, setFile] = useState();
    const FormSubmit = async(event)=>{
        event.preventDefault();
        const form = event.target;
        console.log(form.post_title.value);
        var fileData;
        if (file) {
            const fileForm = new FormData();
            fileForm.append("file_name", file.name);
            fileForm.append("file_type", 'disscussion');
            fileForm.append("file", file);
            const fileRes = await fetch(`https://localhost:7134/api/Files`, {
                method: 'POST',
                body: fileForm

            })
            fileData = await fileRes.json();
        }
       
        const res  = await fetch(`https://localhost:7053/api/Posts`,{
            method: 'POST',
            body: JSON.stringify({
                "post_content": form.post_content.value,
                "post_title": form.post_title.value,
                "create_by": claims.role_name + "/" + claims.user_id,
                "discussiondisscussion_id": router.query.disscussionId,
                "file_id": "Files/" + fileData.file_id
            }),
            headers: {
                'Content-Type':'application/json'
            }
        })
       
    }
  return (
    <div className='p-3'>
        
        <form onSubmit={e=>FormSubmit(e)}>
            <label htmlFor='post_title' className='form-label'>Title:</label>
            <input type='text' className='form-control' id='post_title'/>
            <label htmlFor='post_content' className='form-label'>Desciption:</label>
              <textarea type='text' className='form-control' id='post_content' />
              <label htmlFor='file' className='form-label'>File</label>
              <input onChange={e => setFile(e.target.files[0])} type="file" className="form-control" id='file' />
            <button type='submit' className='btn btn-lg btn-success m-3 float-end'>Submit</button>
        </form>
    </div>
  )
}

export default CreateDisscussion