import React, { useEffect, useMemo } from 'react'
import { io } from 'socket.io-client'
import { getUser } from '../../utils/getuserdata';
import { EventType } from '../../interface/EventEnum';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import Loader from '../../widgets/Loader';
import { getChatMessages, getUserChats, setChatUser } from '../../reducer/chatReducer';
import { ChatListInterface, ChatMessageInterface } from '../../interface/chat';
import { UserType } from '../../interface/user';

const socket = io("http://localhost:8080", { withCredentials: true });

const OnlineUserList = () => {
    // const socket = useMemo(() => {
    //     return io("http://localhost:8080", { withCredentials: true, auth: { accessToken: getUser() } });
    // }, [])

    const dispatch = useAppDispatch();
    const { userChats, isLoading, authToken, selectedChat } = useAppSelector(state => state.chat)

    const OnConnected = () => {
        console.log("first")
    }
    const onDisconnect = () => {

    }

    const onTyping = () => {

    }

    const onStopTyping = () => {

    }

    const onMessageReceiver = () => {


    }

    const onNewChat = () => {

    }

    const onLeaveChat = () => {


    }

    const onUpdateGroupName = () => {

    }

    const messageDelete = () => {


    }

    useEffect(() => {
        if (!socket) return;

        socket.on(EventType.CONNECTED_EVENT, OnConnected)
        socket.on(EventType.DISCONNECT_EVENT, onDisconnect)
        socket.on(EventType.TYPING_EVENT, onTyping)
        socket.on(EventType.STOP_TYPING_EVENT, onStopTyping)
        socket.on(EventType.MESSAGE_RECEIVED_EVENT, onMessageReceiver)
        socket.on(EventType.NEW_CHAT_EVENT, onNewChat)
        socket.on(EventType.LEAVE_CHAT_EVENT, onLeaveChat)
        socket.on(EventType.UPDATE_GROUP_NAME_EVENT, onUpdateGroupName)
        socket.on(EventType.MESSAGE_DELETE_EVENT, messageDelete)

        return () => {
            socket.off(EventType.CONNECTED_EVENT, OnConnected)
            socket.off(EventType.DISCONNECT_EVENT, onDisconnect)
            socket.off(EventType.TYPING_EVENT, onTyping)
            socket.off(EventType.STOP_TYPING_EVENT, onTyping)
            socket.off(EventType.MESSAGE_RECEIVED_EVENT, onMessageReceiver)
            socket.off(EventType.NEW_CHAT_EVENT, onNewChat)
            socket.off(EventType.LEAVE_CHAT_EVENT, onLeaveChat)
            socket.off(EventType.UPDATE_GROUP_NAME_EVENT, onUpdateGroupName)
            socket.off(EventType.MESSAGE_DELETE_EVENT, messageDelete)
        }
    }, [socket])

    useEffect(() => {
        dispatch(getUserChats(null))
    }, [])

    const loadSelectedUserChat = (id: string, selectedUser: any) => {
        if (selectedUser._id !== selectedChat?._id) {
            dispatch(getChatMessages(id)).then((res) => {
                if (res.type === "chat/getChatMessages/fulfilled") {
                    dispatch(setChatUser(selectedUser))
                }
            })
        }
    }

    return (
        <div className='row position-relative'>
            <div className="d-none d-md-block">
                <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                        <input type="text" className="form-control my-3" placeholder="Search..." />
                    </div>
                </div>
            </div>
            <div className='list-group user-list'>
                {userChats?.data?.map((item: ChatListInterface, index: number) => {
                    let showUser = item.participants.find((val: UserType) => val._id !== authToken?.data?._id)
                    return <div
                        key={item._id}
                        className="list-group-item list-group-item-action my-1 pointer"
                        onClick={() => loadSelectedUserChat(item._id, showUser)}>
                        <div className="badge bg-success float-end">5</div>
                        <div className="d-flex align-items-start">
                            <img src="https://bootdey.com/img/Content/avatar/avatar5.png" className="rounded-circle me-1" alt="Vanessa Tucker" width="40" height="40" />
                            <div className="flex-grow-1 ms-3">
                                {showUser?.username}
                                <div className="small"><span className="fas fa-circle chat-online"></span> Online</div>
                            </div>
                        </div>
                    </div>
                }
                )}
            </div>
        </div >
    )
}

export default OnlineUserList