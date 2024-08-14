import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from "../store/hook"
import OnlineUserList from '../components/chatPageCompo/OnlineUserList'
import Messages from '../components/chatPageCompo/Messages'
import { ChatListInterface, ChatMessageInterface,LastMessageType } from '../interface/chat'
import { setChatUser, setChatMessages } from '../reducer/chatReducer'
import { io } from 'socket.io-client'
import { EventType } from '../interface/EventEnum'
import { UserType } from '../interface/user'
import { deleteMessage, getAllMessages, getUserChats, sendUserMessage } from '../hepler/apiCall'
import ChatList from '../components/chatPageCompo/ChatList'
import { requestApiHandler } from '../utils'
import { toastMessage } from '../widgets/toastMessage'
import Loader from '../widgets/Loader'

const socket = io("http://localhost:8080", { withCredentials: true });

const Chat = () => {

  const [typeMessage, setTypeMessage] = useState<string>()
  const [isConnected, setisConnected] = useState<boolean>(false)
  const [isSelfTyping, setIsselfTyping] = useState<boolean>(false)
  const [isTyping, setIsTyping] = useState<boolean>(false)
  const [attachments, setAttachments] = useState<File[]>([])
  const [unreadCount, setUnreadCount] = useState<ChatMessageInterface[]>([])
  const [messageLoading, setMessageLoading] = useState<boolean>(false)
  const [messages, setMessages] = useState<ChatMessageInterface[]>([])
  const [chatLoading, setChatLoading] = useState<boolean>(false)
  const [chats, setChats] = useState<ChatListInterface[]>([])

  const currentChat = useRef<ChatListInterface>()
  const typingTymeOutRef = useRef<any>()

  const { selectedChat, authToken } = useAppSelector(state => state.chat)
  const dispatch = useAppDispatch();


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
  }, [socket, chats])

  useEffect(() => {
    getChats()
  }, [])

  const getChats = async () => {
    await requestApiHandler(
      async () => await getUserChats(),
      setChatLoading,
      (res) => {
        const { data } = res;
        setChats(data || [])
      },
      (error) => {
        toastMessage(error.msg, "error")
      }
    )
  }


  const OnConnected = () => {
    setisConnected(true)
  }

  const onDisconnect = () => {
    setisConnected(false)
  }

  const onTyping = (chatId: string) => {
    // Check if the typing event is for the currently active chat.
    if (chatId !== currentChat.current?._id) return;
    // Set the typing state to true for the current chat.
    setIsTyping(true)
  }

  const onStopTyping = (chatId: string) => {
    // Check if the stop typing event is for the currently active chat.
    if (chatId !== currentChat.current?._id) return;
    // Set the typing state to false for the current chat.
    setIsTyping(false);
  }

  const onMessageReceiver = (message: ChatMessageInterface) => {
    if (message.chat === currentChat.current?._id) {
      setMessages((pre) => [message, ...pre]);
    } else {
      setUnreadCount((pre) => [message, ...pre])
    }
    updateChatLastMessage(message.chat || "", message)
  }

  const onNewChat = () => {

  }

  const onLeaveChat = () => {


  }

  const onUpdateGroupName = () => {

  }

  const messageDelete = (message: LastMessageType) => {
    if (message.deleted.chat === currentChat.current?._id) {
      setMessages((prev) => prev.filter((val) => val._id !== message.deleted._id))
    } else {
      setUnreadCount((prev) => prev.filter((val) => val._id !== message.deleted._id))
    }
    updateLastMessageOnDelete(message.deleted.chat,message)
  }

  // at send messageTime
  const updateChatLastMessage = (currentChatId: string, data: ChatMessageInterface) => {
    setChats((pre) => pre.map((val) => {
      if (val._id === currentChatId) {
        return { ...val, lastMessage: data }
      }
      return val;
    }))
  }

  const loadSelectedUserChat = async (item: ChatListInterface) => {
    if (item._id === selectedChat?._id) return;

    await requestApiHandler(
      async () => await getAllMessages(item._id),
      setMessageLoading,
      (res) => {
        const { data } = res;
        setMessages(data || [])
        dispatch(setChatUser(item))
        currentChat.current = item;
        socket?.emit(EventType.JOIN_CHAT_EVENT, item._id)
        setUnreadCount(unreadCount.filter((val) => val.chat !== item._id))
      },
      (error: any) => {
        toastMessage(error.msg, "error")
      }

    )
  }


  const handleTypeMessage = (e: ChangeEvent<HTMLInputElement>) => {
    setTypeMessage(e.target.value)

    if (!socket || !isConnected) return;
    if (!isSelfTyping) {
      setIsselfTyping(true)
      socket.emit(EventType.TYPING_EVENT, selectedChat._id)
    }

    if (typingTymeOutRef.current) {
      clearTimeout(typingTymeOutRef.current)
    }

    typingTymeOutRef.current = setTimeout(() => {
      socket.emit(EventType.STOP_TYPING_EVENT, selectedChat._id)
    }, 3000);
    setIsselfTyping(false);
  }

  const sendMessage = async () => {

    if (!currentChat.current?._id || !socket) return;
    socket.emit(EventType.STOP_TYPING_EVENT, selectedChat._id)

    await requestApiHandler(
      async () => await sendUserMessage(currentChat.current?._id || "", typeMessage || "", attachments),
      null,
      (res) => {
        setTypeMessage("")
        setAttachments([])
        setMessages((pre) => [res.data, ...pre]);
        updateChatLastMessage(currentChat.current?._id || '', res.data)
      },
      (error) => {
        toastMessage(error?.msg, "error")
      }
    )
  }

  // when delete messages
  const updateLastMessageOnDelete = (chatId: string, data:LastMessageType ) => {

    if (data.lastMessage) {
      setChats((pre) => pre.map((val) => {
        if (val._id === chatId) {
          return { ...val, lastMessage: data.lastMessage }
        }
        return val;
      }))
    }
  }

  const onMessageDelete = async (msg: ChatMessageInterface) => {
    await requestApiHandler(
      async () => await deleteMessage(currentChat.current?._id || "", msg._id),
      null,
      (res) => {
        const { data } = res
        console.log(data, "res")
        setMessages((pre) => pre.filter((val) => val._id !== msg._id))
        updateLastMessageOnDelete(msg.chat, data)
      },
      (error) => {
        toastMessage(error?.msg, "error")
      }
    )
  }

  return (
    <main className="content">
      <div className="container p-0">
        <div className="row g-0">
          <div className="col-12 col-lg-5 col-xl-3 border-right">
            <div className='row position-relative'>
              <div className="d-none d-md-block">
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <input type="text" defaultValue={authToken?.data?.username} className="form-control my-3" placeholder="Search..." />
                  </div>
                </div>
              </div>
              <div className='list-group user-list'>
                {chatLoading && <Loader />}
                {chats?.map((item: ChatListInterface, index: number) => <ChatList
                  key={item._id}
                  item={item}
                  loadSelectedUserChat={loadSelectedUserChat}
                  curretUserId={authToken?.data?._id}
                  isActive={currentChat.current?._id === item._id}
                  ureadCount={unreadCount?.filter((val) => val.chat === item._id).length}
                />
                )}
              </div>
            </div >
          </div>


          <div className="col-12 col-lg-7 col-xl-9 min-vh-100">
            <div>
              {selectedChat?.participants?.length
                ? <>
                  {/* selected user */}
                  <div className='row'>
                    <div className="py-2 px-4 border-bottom d-none d-lg-block">
                      <div className="d-flex align-items-center py-1">
                        <div className="position-relative">
                          <img src="https://bootdey.com/img/Content/avatar/avatar3.png" className="rounded-circle me-1" alt="Sharon Lessman" width="40" height="40" />
                        </div>
                        <div className="flex-grow-1 pl-3">
                          <strong>{selectedChat?.participants?.find((val: UserType) => val._id !== authToken?.data?._id)?.username}</strong>
                          {isTyping && <div className="text-muted small"><em>Typing...</em></div>}
                        </div>
                        <div>
                          <button className="btn  border-0 btn-lg me-1 px-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-phone feather-lg"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg></button>
                          <button className="btn border-0 btn-lg me-1 px-3 d-none d-md-inline-block"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-video feather-lg"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg></button>
                          <button className="btn  border-0 btn-lg px-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal feather-lg"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg></button>
                        </div>
                      </div>
                    </div>
                  </div>


                  {/* show messages */}
                  <div className="position-relative">
                    <div className="chat-messages">
                      {messageLoading && <Loader />}
                      {messages?.map((msgdata: ChatMessageInterface) =>
                        <Messages
                          key={msgdata._id}
                          isOwanMessage={msgdata.sender?._id === authToken?.data?._id}
                          isGroupChatMessage={false}
                          message={msgdata}
                          onMessageDelete={onMessageDelete}
                        />
                      )}
                    </div>
                  </div>
                  {attachments.length > 0
                    ? <div className='row'>
                      {attachments.map((file, i) => <div className='col-2' key={i}> <div className='position-relative'>
                        <img className='img-fluid' height="150px" src={URL.createObjectURL(file)} alt="" />
                        <div className="position-absolute top-0 end-0 pointer" onClick={() => setAttachments(attachments.filter((val, ind) => ind !== i))}><i className="bi bi-x-circle text-danger"></i></div>
                      </div>
                      </div>)}
                    </div>
                    : null
                  }

                  {/* Message send button  */}
                  <div className="d-flex align-items-center py-3 px-4 border-top">
                    <input
                      type="file"
                      name=""
                      hidden
                      id="attachment"
                      multiple
                      onChange={(e) => {
                        if (e.target.files) {
                          setAttachments([...e.target.files])
                        }
                      }}
                    />
                    <label style={{ width: "4%", fontSize: "20px", padding: 0, cursor: "pointer" }} htmlFor='attachment'>
                      <i className="bi bi-paperclip"></i>
                    </label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Type your message"
                        value={typeMessage || ""}
                        onChange={handleTypeMessage}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            sendMessage()
                          }
                        }}
                      />
                      <button disabled={!typeMessage && attachments.length <= 0} onClick={sendMessage} className="btn btn-primary">Send</button>
                    </div>
                  </div>
                </>
                : <p className='text-center'>No chat Selected !</p>
              }
            </div>
          </div>
        </div>
      </div>
    </main >
  )
}

export default Chat