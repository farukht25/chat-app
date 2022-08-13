import React from 'react'
import HoverMenu from '../components/HoverMenu'
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt';
import DoneIcon from '@mui/icons-material/Done';
import { green } from '@mui/material/colors';
import DoneAllIcon from '@mui/icons-material/DoneAll';


function ChatMessage({ m, user, setHoweredOnmessageId, howeredOnmessageId, editMessage, deleteMessage, currentChatUser, dummy }) {

    const formatTime = () => {
        if (!m.timestamp) return ''
        let time = m.timestamp.toDate().toLocaleTimeString()
        let amOrPM = time.slice(-2);
        time = time.replace(/:[^:]+$/, "")
        return time + ' ' + amOrPM;
    }

    const getReadStatus = (m) => {
        let seenByArray = m.seenBy;
        if (seenByArray.includes(user.email) && seenByArray.includes(currentChatUser.email)) return <DoneAllIcon sx={{ fontSize: 15, color: green[500] }} />
        return <DoneIcon sx={{ fontSize: 15, color: green[500] }} />
    }
    const handleOnLoad = () => {
        dummy.current.scrollIntoView({ behaviour: 'smooth' })
    }

    if (m.isDeleted) return (
        <div
            key={m.id}
            className={m.from === user.email ? "from-me deleted " : "from-them deleted"}>
            <DoNotDisturbAltIcon sx={{ fontSize: 15 }} />
            Message Deleted
        </div>)

    if (m.imageURL)
        return (
            <>
                {m.isEdited && <span className={m.from === user.email ? "right" : " left"}>edited</span>}
                <div className={m.from === user.email ? "from-me chatMessage__image__container" : "from-them chatMessage__image__container"}
                    onMouseEnter={() => setHoweredOnmessageId(m.id)}
                    onMouseLeave={() => setHoweredOnmessageId(null)}>
                    <img className='chatMessage__image' src={m.imageURL} alt="preview" onLoad={handleOnLoad} />
                    <span className='chatMessage__image__textAndReadReceit' >
                        <span className='chatMessage__image__text'>{m.text}</span>

                        {(m.id === howeredOnmessageId) ?
                            <HoverMenu
                                key={m.id}
                                isUserMessage={(user.email !== m.to)}
                                editMessage={editMessage}
                                message={m}
                                deleteMessage={deleteMessage}
                                messageId={m.id}
                                setHoweredOnmessageId={setHoweredOnmessageId} /> :
                            ((m.from !== user.email) ?
                                <span className='chatMessage__image__ReadReceit'></span> : <span className='chatMessage__image__ReadReceit'>
                                    {getReadStatus(m)}
                                </span>)

                        }
                    </span>
                </div>
                <span className={m.from === user.email ? "right time" : "left time"}>{formatTime()}</span>
            </>
        )



    return <>
        {m.isEdited && <span className={m.from === user.email ? "right" : " left"}>edited</span>}
        <div key={m.id}
            onMouseEnter={() => setHoweredOnmessageId(m.id)}
            onMouseLeave={() => setHoweredOnmessageId(null)}
            className={m.from === user.email ? "from-me " : "from-them "}>
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
                ((m.from !== user.email) ?
                    <span className='chat__menu__placeholder'></span> : getReadStatus(m))

            }
        </div>
        <span className={m.from === user.email ? "right time" : "left time"}>{formatTime()}</span>



    </>;
}

export default ChatMessage