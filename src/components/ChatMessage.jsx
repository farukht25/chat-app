import React from 'react'
import HoverMenu from '../components/HoverMenu'
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt';

function ChatMessage({ m, user, setHoweredOnmessageId, howeredOnmessageId, editMessage, deleteMessage }) {

    if (m.isDeleted) return (
        <p
            key={m.id}
            className={m.from === user.email ? "from-me deleted" : "from-them deleted"}>
            <DoNotDisturbAltIcon sx={{ fontSize: 15 }} />
            Message Deleted
        </p>)

    return <>
        <p key={m.id}
            onMouseEnter={() => setHoweredOnmessageId(m.id)}
            onMouseLeave={() => setHoweredOnmessageId(null)}
            className={m.from === user.email ? "from-me" : "from-them"}>
            {m.text}
            {(m.id === howeredOnmessageId) ?
                <HoverMenu
                    key={m.id}
                    isUserMessage={(user.email !== m.to)}
                    editMessage={editMessage}
                    message={m}
                    deleteMessage={deleteMessage}
                    messageId={m.id}
                    setHoweredOnmessageId={setHoweredOnmessageId} /> :
                <span key={m.id} className='chat__menu__placeholder'> </span>
            }
        </p>

    </>;
}

export default ChatMessage