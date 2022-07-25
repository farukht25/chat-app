import { query, collection, onSnapshot, orderBy, addDoc } from 'firebase/firestore';
import React, { useEffect, useState, useRef } from 'react'
import { db } from '../firebase';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { serverTimestamp } from "firebase/firestore";
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';

function Chat({ user, currentChatUser }) {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const dummy = useRef()
    useEffect(() => {
        if (user && Object.keys(user).length !== 0 && currentChatUser) {
            const q = query(collection(db, "chats", user.email, "message"), orderBy('timestamp'));
            const unsub = onSnapshot(q, (snapshot) => {
                let allMessages = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
                let newMessages = allMessages.filter(mes => {
                    if (mes.to === currentChatUser || mes.from === currentChatUser)
                        return true;
                    else return false
                })
                setMessages(prev => newMessages)
                dummy.current.scrollIntoView({ behavior: 'smooth' });
            })


            return () => unsub()


        }
    }, [user, currentChatUser])
    const sendMessage = (e) => {
        e.preventDefault();
        // sender
        if (message) {
            dummy.current.scrollIntoView({ behaviour: 'smooth' })
            addDoc(collection(db, `chats/${user.email}/message`), {
                to: currentChatUser,
                from: user.email,
                timestamp: serverTimestamp(),
                text: message
            })

            // receiver
            addDoc(collection(db, `chats/${currentChatUser}/message`), {
                from: user.email,
                to: currentChatUser,
                timestamp: serverTimestamp(),
                text: message
            })

            setMessage('');
            dummy.current.scrollIntoView({ behaviour: 'smooth' })
        }
    }

    return ((user && Object.keys(user).length !== 0 && currentChatUser) ? (
        <>
            <div className="chat__meassages">

                {
                    messages.map(m => {
                        return <p key={m.id} className={m.from === user.email ? "from-me" : "from-them"}>{m.text} </p>
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
                        {/* <button type='submit' >
                            <SendRoundedIcon color="dark" fontSize="large" />
                        </button> */}
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