import Cookies from "js-cookie"

export  const setUser = (accessToken:string,refreshToken:string)=>{
    Cookies.set("accessToken",accessToken)
    Cookies.set("refreshToken",refreshToken)
}

export const getUser = ()=>{
    return Cookies.get("accessToken") || null
}
