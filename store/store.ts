import { configureStore } from "@reduxjs/toolkit";
import chetReducer from "../reducer/chatReducer"


 const store = configureStore({reducer:{
    chat:chetReducer
}})


export type Rootstate = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;


export default store;