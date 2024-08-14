import React from 'react'

const SendMessageBox = () => {
    return (
        <div className="flex-grow-0 py-3 px-4 border-top">
            <div className="input-group">
                <input type="text" className="form-control" placeholder="Type your message" />
                <button className="btn btn-primary">Send</button>
            </div>
        </div>
    )
}

export default SendMessageBox