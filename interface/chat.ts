import { UserType } from "./user"

export interface ChatListInterface {
    _id: string,
    name: string,
    isGroupChat: boolean,
    participants: UserType[],
    createdAt: string,
    updatedAt: string,
    lastMessage?: ChatMessageInterface
}


export interface ChatMessageInterface {
    _id: string,
    sender: Pick<UserType, "_id" | "avatar" | "email" | "fullname" | "username">,
    content: string,
    attchment: [
        {
            url: string,
            _id: string
        }
    ],
    chat: string,
    createdAt: string,
    updatedAt: string,
}


export interface LastMessageType {
    deleted: ChatMessageInterface;
    lastMessage?: ChatMessageInterface
}