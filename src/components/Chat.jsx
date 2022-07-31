import { query, collection, onSnapshot, orderBy, addDoc, updateDoc, getDoc, doc} from 'firebase/firestore';
import React, { useEffect, useState, useRef } from 'react'
import { db } from '../firebase';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { serverTimestamp } from "firebase/firestore";
import Button from '@mui/material/Button';

import ChatMessage from './ChatMessage';

function Chat({ user, currentChatUser }) {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [howeredOnmessageId, setHoweredOnmessageId] = useState(null);
    const dummy = useRef()
    useEffect(() => {
        
        
        if (user && Object.keys(user).length !== 0 && currentChatUser) {

            const q = query(collection(db, "chats", user.email, "messages"), orderBy('timestamp'));
            const unsub = onSnapshot(q, (snapshot) => {
                let allMessages = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
                let newMessages = allMessages.filter(mes => {
                    return (mes.to === currentChatUser || mes.from === currentChatUser)

                })
                setMessages(prev => newMessages)

            })
            
            


            return () => unsub()



        }
    }, [user, currentChatUser])


    const deleteMessage = async (messageId,justMe) => {
        try {
            const docSnap = await getDoc(doc(db, `chats/${user.email}/messages`, messageId));
            const copyMessageId = docSnap._document.data.value.mapValue.fields.copyId.stringValue
            if(justMe)
            {
                updateDoc(doc(db, `chats/${user.email}/messages`, messageId), { isDeleted: true })
            }
            else{
            await Promise.all([
                updateDoc(doc(db, `chats/${user.email}/messages`, messageId), { isDeleted: true }),
                updateDoc(doc(db, `chats/${currentChatUser}/messages`, copyMessageId), { isDeleted: true })
            ])}
        
            setHoweredOnmessageId(null)
        }
        catch (error) {
            console.log(error)
        }
    }
    const editMessage =  async(messageId,newMessage) => {
        try {
            console.log('edit func'+messageId)

            const docSnap = await getDoc(doc(db, `chats/${user.email}/messages`, messageId));
            const copyMessageId = docSnap._document.data.value.mapValue.fields.copyId.stringValue
            await Promise.all([
                updateDoc(doc(db, `chats/${user.email}/messages`, messageId), { text: newMessage, isEdited:true }),
                updateDoc(doc(db, `chats/${currentChatUser}/messages`, copyMessageId), { text: newMessage, isEdited:true })
            ])
            setHoweredOnmessageId(null)
        }
        catch (error) {
            console.log(error)
        }
    }
    const copyReference = async (receiverCopy, senderCopy) => {
        try {
            await Promise.all([
                updateDoc(doc(db, `chats/${user.email}/messages`, senderCopy), { copyId: receiverCopy }),
                updateDoc(doc(db, `chats/${currentChatUser}/messages`, receiverCopy), { copyId: senderCopy })
            ])

        }
        catch (error) {
            console.log(error)
        }
    }

    const sendMessage = async (e) => {
        e.preventDefault();
        const messageLocal = message
        setMessage('');
        try {
            if (messageLocal) {
                dummy.current.scrollIntoView({ behaviour: 'smooth' })
                const [senderCopy, receiverCopy] = await Promise.all([
                    addDoc(collection(db, `chats/${user.email}/messages`), {
                        to: currentChatUser,
                        from: user.email,
                        timestamp: serverTimestamp(),
                        text: messageLocal,
                        isDeleted: false,
                        isEdited:false
                    }),
                    addDoc(collection(db, `chats/${currentChatUser}/messages`), {
                        from: user.email,
                        to: currentChatUser,
                        timestamp: serverTimestamp(),
                        text: messageLocal,
                        isDeleted: false,
                        isEdited:false
                    })])

                copyReference(receiverCopy._key.path.segments[3], senderCopy._key.path.segments[3])

                dummy.current.scrollIntoView({ behaviour: 'smooth' })
            }
        }
        catch (error) { console.log(error) }
    }


    return ((user && Object.keys(user).length !== 0 && currentChatUser) ? (
        <>
            <div className="chat__meassages">

                {
                    messages.map(m => {
                        return <ChatMessage m={m} user={user} setHoweredOnmessageId={setHoweredOnmessageId}
                             howeredOnmessageId={howeredOnmessageId} editMessage={editMessage} deleteMessage={deleteMessage}/>
                        
                    })
                }
                <span ref={dummy}></span>
            </div>
            <form type='submit' onSubmit={e => sendMessage(e)}>
                <div className='chat__form'>

                    <div className='chat__form_input'>

                        <input placeholder='Enter Message...' value={message} onChange={e => setMessage(e.target.value)} />
                    </div>
                    <div className='chat__form__button'>

                        <Button type='submit' variant="dark" endIcon={<SendRoundedIcon color="dark" fontSize="large" />}>
                            Send
                        </Button>
                    </div>


                </div>
            </form>
        </>) : null
    )

}

export default Chat

// function ChatBlurb(m, user, setHoweredOnmessageId, howeredOnmessageId, editMessage, deleteMessage) {
//     return <>
//         {m.isDeleted ? <p key={m.id} className={m.from === user.email ? "from-me deleted" : "from-them deleted"}>
//             <DoNotDisturbAltIcon sx={{ fontSize: 15 }} />Message Deleted</p> : <p key={m.id}
//                 onMouseEnter={() => setHoweredOnmessageId(m.id)}
//                 onMouseLeave={() => setHoweredOnmessageId(null)}
//                 className={m.from === user.email ? "from-me" : "from-them"}> {m.text}
//             {(m.id === howeredOnmessageId) ?
//                 <HoverMenu key={m.id} isUserMessage={(user.email !== m.to)} editMessage={editMessage} message={m} deleteMessage={deleteMessage} messageId={m.id} /> :
//                 <span key={m.id} className='chat__menu__placeholder'> </span>}
//         </p>}

//     </>;
// }
