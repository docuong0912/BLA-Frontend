import Cookies from "js-cookie"

export function setToken(token){
    Cookies.set('jwt',token.toString())
}
export function getToken(){
    return Cookies.get('jwt')
}
export function removeToken(){
    Cookies.remove('jwt')
}
