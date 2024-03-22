export async function fetchUserList(disscussion){
    const users = disscussion?.user?.map(d=>d.user_id);
        const userRequests = users?.map(userId =>
            fetch(`https://localhost:7277/api/${userId.split("/")[0]}/details/${userId.split("/")[1]}`,{
                method:'GET'
            })
            );
            try {
                const responses = await Promise.all(userRequests);
                const users = await Promise.all(responses.map(response => response.json()));
                
                return users
            
                // Process the fetched users as needed
            } catch (error) {
                console.error("Error fetching users:", error);
            }
}
