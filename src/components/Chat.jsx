import { query, collection, onSnapshot, orderBy, addDoc, updateDoc, setDoc, getDoc, doc, update, where } from 'firebase/firestore';
import React, { useEffect, useState, useRef } from 'react'
import { db } from '../firebase';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { serverTimestamp } from "firebase/firestore";
import Button from '@mui/material/Button';
import HoverMenu from '../components/HoverMenu'
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

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
                dummy.current.scrollIntoView({ behavior: 'smooth' });
            })


            return () => unsub()



        }
    }, [user, currentChatUser])


    const deleteMessage = async (messageId) => {
        try {
            const docSnap = await getDoc(doc(db, `chats/${user.email}/messages`, messageId));
            const copyMessageId = docSnap._document.data.value.mapValue.fields.copyId.stringValue
            await Promise.all([
                updateDoc(doc(db, `chats/${user.email}/messages`, messageId), { isDeleted: true }),
                updateDoc(doc(db, `chats/${currentChatUser}/messages`, copyMessageId), { isDeleted: true })
            ])
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
                updateDoc(doc(db, `chats/${user.email}/messages`, messageId), { text: newMessage }),
                updateDoc(doc(db, `chats/${currentChatUser}/messages`, copyMessageId), { text: newMessage })
            ])
            
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
                        isDeleted: false
                    }),
                    addDoc(collection(db, `chats/${currentChatUser}/messages`), {
                        from: user.email,
                        to: currentChatUser,
                        timestamp: serverTimestamp(),
                        text: messageLocal,
                        isDeleted: false
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
                        return (<>
                            {m.isDeleted ? <p className={m.from === user.email ? "from-me deleted" : "from-them deleted"}>Message Deleted</p> : <p key={m.id}
                                onMouseEnter={() => setHoweredOnmessageId(m.id)}
                                onMouseLeave={() => setHoweredOnmessageId(null)}
                                className={m.from === user.email ? "from-me" : "from-them"}> {m.text}
                                {(m.from === user.email && m.id === howeredOnmessageId) ? 
                                <HoverMenu editMessage={editMessage} message={m} deleteMessage={deleteMessage} messageId={m.id}/> :
                                 <span className='chat__menu__placeholder'> </span>}
                            </p>}

                        </>
                        )
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