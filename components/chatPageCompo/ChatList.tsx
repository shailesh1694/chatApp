import React from 'react'
import { ChatListInterface } from '../../interface/chat'
import { UserType } from '../../interface/user'
import { useAppSelector } from '../../store/hook';




const ChatList: React.FC<
    { item: ChatListInterface; loadSelectedUserChat: (a: ChatListInterface) => void, curretUserId: string, isActive?: boolean, ureadCount?: number }>
    = ({ item, loadSelectedUserChat, curretUserId, isActive, ureadCount }) => {
        let showUser = item?.participants?.find((val: UserType) => val._id !== curretUserId)

        return (<div
            className={`list-group-item list-group-item-action my-1 pointer ${isActive && "list-active"}`}
            onClick={() => loadSelectedUserChat(item)}>
            {ureadCount && ureadCount > 0 ? <div className="badge bg-success float-end">{ureadCount}</div> :null}
            <div className="d-flex align-items-start">
                <img src="https://bootdey.com/img/Content/avatar/avatar5.png" className="rounded-circle me-1" alt="Vanessa Tucker" width="40" height="40" />
                <div className="flex-grow-1 ms-3">
                    {showUser?.username}
                    <div className="small"><span className="fas fa-circle chat-online"></span> Online</div>
                </div>
            </div>
        </div>
        )
    }

export default ChatList