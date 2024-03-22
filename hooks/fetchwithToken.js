const fetchWithToken = async (url, token) => {
    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            if (response.status == 401) {
                removeToken();
            }
        }

        const data = await response.json();
        return data;
    } catch (error) {

    }
};
export default fetchWithToken;