import React, { useEffect } from 'react'
import HoverMenu from '../components/HoverMenu'
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt';
import Chip from '@mui/material/Chip';

function ChatMessage({ m, user, setHoweredOnmessageId, howeredOnmessageId, editMessage, deleteMessage }) {

    const formatTime = () => {
        if(!m.timestamp) return ''
        let tim = m.timestamp.toDate().toLocaleTimeString()
        let end = tim.slice(-2);
        tim = tim.replace(/:[^:]+$/, "")
        return tim + ' ' + end;
    }


    if (m.isDeleted) return (
        <div
            key={m.id}
            className={m.from === user.email ? "from-me deleted" : "from-them deleted"}>
            <DoNotDisturbAltIcon sx={{ fontSize: 15 }} />
            Message Deleted
        </div>)

    return <>
        {m.isEdited && <span className={m.from === user.email ? "right" : " left"}>edited</span>}
        <div key={m.id}
            onMouseEnter={() => setHoweredOnmessageId(m.id)}
            onMouseLeave={() => setHoweredOnmessageId(null)}
            className={m.from === user.email ? "from-me" : "from-them"}>
            <span>{m.text}</span>

            {(m.id === howeredOnmessageId) ?
                <HoverMenu
                    key={m.id}
                    isUserMessage={(user.email !== m.to)}
                    editMessage={editMessage}
                    message={m}
                    deleteMessage={deleteMessage}
                    messageId={m.id}
                    setHoweredOnmessageId={setHoweredOnmessageId} /> :
                <span key={m.id} className='chat__menu__placeholder'></span>
            }
        </div>
        <span className={m.from === user.email ? "right time" : "left time"}>{formatTime()}</span>


    </>;
}

export default ChatMessage