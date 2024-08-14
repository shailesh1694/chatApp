import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../hepler/apiCall";
import { ApiSuccessResponse } from "../interface/response";
import { date, string } from "yup";
import { UserType } from "../interface/user";

export interface InitialState {
    productData: any;
    authToken: any;
    isLoading: boolean;
    isSuccess: boolean;
    registerUser: any;
    userChats: any;
    selectedChat: any;
    chatMessages: any;
    sendMessagesData: any
}

const initialState: InitialState = {
    productData: undefined,
    authToken: undefined,
    isLoading: false,
    isSuccess: false,
    registerUser: undefined,
    userChats: undefined,
    selectedChat: undefined,
    chatMessages: undefined,
    sendMessagesData: undefined
}


export const getAuthToken = createAsyncThunk<any, any, any>("chat/getAuthToken", async (payload, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get<ApiSuccessResponse>("/users/getAuth")
        return response.data;
    } catch (error: any) {
        // console.log(error,"error")
        return rejectWithValue(error?.response?.data)
    }
})

export const postLoginUser = createAsyncThunk<any, any, any>("chat/postLoginUser", async (payload, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post<ApiSuccessResponse>("users/login", payload)
        return response.data;
    } catch (error: any) {
        // console.log(error,"error")
        return rejectWithValue(error?.response?.data || "internal server error !")
    }
})
export const postRegisterUser = createAsyncThunk<any, any, any>("chat/postRegisterUser", async (payload, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post<ApiSuccessResponse>("users/register", payload, { headers: { "Content-Type": "multipart/form-data" } })
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error?.response?.data)
    }
})

export const getUserChats = createAsyncThunk<any, any, any>("chat/getUserChats", async (payload, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get<ApiSuccessResponse>("chat")
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error?.response?.data)
    }
})

export const getChatMessages = createAsyncThunk<any, any, any>("chat/getChatMessages", async (payload, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get<ApiSuccessResponse>("message/" + payload)
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error?.response?.data)
    }
})

export const postSendMessages = createAsyncThunk<any, any, any>("chat/postSendMessages", async (payload, { rejectWithValue }) => {
    try {
        console.log(payload, "payload")
        const response = await axiosInstance.post<ApiSuccessResponse>("message/" + payload.paramsId, { content: payload.content, attachments: payload.attachments }, { headers: { "Content-Type": "multipart/form-data" } })
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error?.response?.data)
    }
})

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setChatUser: (state, action) => {
            state.selectedChat = action.payload
        },
        setChatMessages: (state, action) => {
            state.chatMessages.data = [action.payload, ...state.chatMessages.data]
        }
    },
    extraReducers(builder) {
        builder
            .addCase(getAuthToken.pending, (state, action) => {
                state.authToken = action.payload
            })
            .addCase(getAuthToken.fulfilled, (state, action) => {
                state.authToken = action.payload
            })
            .addCase(getAuthToken.rejected, (state, action) => {
                state.authToken = action.payload
            })
            .addCase(postLoginUser.pending, (state, action) => {
                state.isLoading = true
                state.isSuccess = false
            })
            .addCase(postLoginUser.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.authToken = action.payload
            })
            .addCase(postLoginUser.rejected, (state, action) => {
                state.isLoading = false
                state.isSuccess = false
                state.authToken = action.payload
            })
            .addCase(postRegisterUser.pending, (state, action) => {
                state.isLoading = true
                state.isSuccess = false
            })
            .addCase(postRegisterUser.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.authToken = action.payload
            })
            .addCase(postRegisterUser.rejected, (state, action) => {
                state.isLoading = false
                state.isSuccess = false
                state.authToken = action.payload
            })
            .addCase(getUserChats.pending, (state, action) => {
                state.isLoading = true
                state.isSuccess = false
            })
            .addCase(getUserChats.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.userChats = action.payload
            })
            .addCase(getUserChats.rejected, (state, action) => {
                state.isLoading = false
                state.isSuccess = false
                state.userChats = action.payload
            })
            .addCase(getChatMessages.pending, (state, action) => {
                state.isLoading = true
                state.isSuccess = false
            })
            .addCase(getChatMessages.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.chatMessages = action.payload
            })
            .addCase(getChatMessages.rejected, (state, action) => {
                state.isLoading = false
                state.isSuccess = false
                state.chatMessages = action.payload
            })
            .addCase(postSendMessages.pending, (state, action) => {
                state.isLoading = true
                state.isSuccess = false
            })
            .addCase(postSendMessages.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.sendMessagesData = action.payload
            })
            .addCase(postSendMessages.rejected, (state, action) => {
                state.isLoading = false
                state.isSuccess = false
                state.sendMessagesData = action.payload
            })
    },
})

export const { setChatUser, setChatMessages } = chatSlice.actions
export default chatSlice.reducer