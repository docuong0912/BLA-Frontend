const { default: axios } = require("axios");
const { getToken, removeToken } = require("../components/auth/auth");
const { tokenExpired } = require("../hooks/useDecodeJwt");
const http = axios.create({
    baseURL: "https://localhost:7015",
    withCredentials: true,
    headers: {
        Accept: 'application/json',
        'Content-Type':'application/json'
    }
})
http.interceptors.request.use(
    async config => {
        if (config.withCredentials) {
            const token = getToken();
            if (token) {
                const expired = tokenExpired(token);
                if (expired) {
                    _redirectToLoginPage();
                    removeToken();
                    return;
                }
                config.headers.Authorization = `Bearer ${token}`
            }
            else {
                _redirectToLoginPage();
            }
            
        }
        return config;
    }, error => {
        return Promise.reject(error)
    }
)
http.interceptors.response.use(
    async res => {
        const { config } = res;
        if (config?.responseType === 'blob') {
            return res
        }

        if (res.status >= 200 && res.status < 300) {
            return res?.data
        }
        return res
        
    }, error => {
        const responseToken = error?.response.headers['token-expired']
        if (responseToken) {
            _redirectToLoginPage();
            return Promise.reject(error?.response)
        }
        const token = getToken();
        if (token && responseToken?.response.status === 401) {
            if (tokenExpired(token)) {
                _redirectToLoginPage();
            }
            else {
                window.location.href = '/error/401'
            }
        }
        if (error?.response?.status === 403) {
            _redirectToUnpermittedPage();
        }

        //if (error?.response?.status === 404) {
        //    _redirectToErrorPage()
        //}
        /*other cases*/
        if (error && error.response && error.response.data.errors && error.response.data.errors.length > 0) {
            const { errors } = error.response.data
            return Promise.reject(errors)
        }

        const errorMessage = error?.response?.data?.message
        if (errorMessage) {
            message.error(t(errorMessage))
        }

        return Promise.reject(error?.response)
    }
)
const _redirectToLoginPage = () => {
    removeToken();
    window.location.href = '/login'
}
const _redirectToErrorPage = () => {

    window.location.href = '/error/404'
}
const _redirectToUnpermittedPage = () => {

    window.location.href = '/error/403'
}
export default http;