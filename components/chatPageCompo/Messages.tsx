import  { useState } from 'react'
import { ChatMessageInterface } from '../../interface/chat';
import moment from 'moment';

interface MessageType {
    isOwanMessage: boolean;
    isGroupChatMessage: boolean;
    message: ChatMessageInterface;
    onMessageDelete: (message: ChatMessageInterface) => void
}

const Messages = ({ isOwanMessage, message, onMessageDelete }: MessageType) => {
    const [isDeleteShow, setIsDeleteShow] = useState<boolean>(false)

    return (

        <div className={`${isOwanMessage ? "chat-message-right pointer" : "chat-message-left"}  pb-4 border my-2 position-relative `} onClick={(e) => {
            if (isOwanMessage) {
                setIsDeleteShow(!isDeleteShow)
            }
        }} >
            {message.content ?
                <div className="bg-light rounded py-2 px-3 me-3">
                    {message.content}
                </div>
                : null
            }
            {
                message?.attchment?.length > 0 ?
                    <div className='d-flex flex-column'>{message.attchment.map((val) => <div key={val._id} className=' position-relative my-1'>
                        <img width="120px" src={val.url} alt="File" />
                        <a href={val.url} download target="_blank" onClick={(e) => e.stopPropagation()}  > <div className="position-absolute top-50 start-50 pointer"><i className="bi bi-box-arrow-down text-danger"></i></div></a>
                    </div>
                    )}
                    </div>
                    : null
            }
            {isDeleteShow && isOwanMessage && <div className="position-absolute end-100 pointer text-danger" onClick={(e) => {
                e.stopPropagation();
                const ok = confirm(
                    "Are you sure you want to delete this message"
                );
                if (ok) {
                    onMessageDelete(message)
                }
            }} >
                <i className="bi bi-archive-fill fs-4" ></i>
            </div>}
            <p className='text-end'>{moment(message.updatedAt).add("TIME_ZONE", 'hours').fromNow(true)} {" "}ago</p>
        </div >

    )
}

export default Messages