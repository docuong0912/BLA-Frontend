const AnnouncementCreate = () => {
    const FormSubmit = async (event) => {
        event.preventDefault();
        const form = event.target;
        console.log(form.post_title.value)
        const res = await fetch(`https://localhost:7053/api/Posts`, {
            method: 'POST',
            body: JSON.stringify({
                "post_content": form.post_content.value,
                "post_title": form.post_title.value,
                "create_by": claims.role_name + "/" + claims.user_id,
                "discussiondisscussion_id": router.query.disscussionId
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })

    }
    return (
        <form onSubmit={e => FormSubmit(e)}>
            <label htmlFor='subject' className='form-label'>Title:</label>
            <input type='text' className='form-control' id='subject' />
            <label htmlFor='message' className='form-label'>Message:</label>
            <input type='text' className='form-control' id='message' />
            <label htmlFor='endDate' className='form-label'>Valid Until:</label>
            <input type='text' className='form-control' id='endDate' />
            <button type='submit' className='btn btn-lg btn-success m-3 float-end'>Submit</button>
        </form>
    );
}
export default AnnouncementCreate;