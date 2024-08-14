import axios from "axios";
import { ApiSuccessResponse } from "../interface/response";

export const axiosInstance = axios.create({ baseURL: "http://localhost:8080/api/v1/", withCredentials: true, })

axiosInstance.interceptors.request.use(function (config) {
    // console.log(config,"config") 
    return config
}, function (error) {
    return Promise.reject(error)
})
axiosInstance.interceptors.response.use(function (config) {
    // console.log(config,"config") 
    return config
}, function (error) {
    return Promise.reject(error)
})


export const getAllMessages = (chatId: string) => {
    return axiosInstance.get("message/" + chatId)
}

export const getUserChats = () => {
    return axiosInstance.get("chat")
}

export const sendUserMessage = (chatId: string, content: string, attachments: File[]) => {
    const formData = new FormData();
    if (content) {
        formData.append("content", content)
    }
    attachments?.map((file) => {
        formData.append("attachments", file)
    })
    return axiosInstance.post("message/" + chatId, formData, { headers: { "Content-Type": "multipart/form-data" } })
}

export const deleteMessage = (chatId: string, messageId: string) => {
    return axiosInstance.delete("message/" + chatId + "/" + messageId)
}

export const userLogin = (username: string, password: number) => {
    return axiosInstance.post("users/login", { username, password })
}
