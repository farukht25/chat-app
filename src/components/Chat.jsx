import { query, collection, onSnapshot, orderBy, Timestamp, where, doc, getDocs, addDoc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { auth, db } from '../firebase';
import { UserAuth } from '../contexts/AuthContext'
import Button from '@mui/material/Button';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { serverTimestamp } from "firebase/firestore";

function Chat({ user, currentChatUser }) {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');



    useEffect(() => {
        if (user && Object.keys(user).length !== 0 && currentChatUser) {
            const userChats = collection(db, "chats", user.email, "message");
            const unsub = onSnapshot(userChats, (snapshot) => {
                let allMessages = snapshot.docs.map(doc => doc.data())
                console.log('allMessages' + JSON.stringify(allMessages))
                let newMessages = allMessages.filter(mes => {
                    console.log("mes.to: " + mes.to + "mes.from: " + mes.from + 'user.email: ' + user.email + "currentChatUser.email: " + currentChatUser + "-->" + (mes.to === (currentChatUser.email || user.email)))
                    if (mes.to === currentChatUser || mes.from === currentChatUser ) return true;
                    else return false
                })
                console.log('newMessages' + newMessages)
                newMessages.sort((a,b)=>a.timestamp-b.timestamp)
                setMessages(newMessages)
            })

            return () => unsub()
        }
    }, [user, currentChatUser])
    const sendMessage = (e) => {
        e.preventDefault();
        // sender

        addDoc(collection(db, `chats/${user.email}/message`), {
            to: currentChatUser,
            from: user.email,
            timestamp: serverTimestamp(),
            text: message
        })

// receiver
        addDoc(collection(db, `chats/${currentChatUser}/message`), {
            from: currentChatUser,
            to: user.email,
            timestamp: serverTimestamp(),
            text: message
        })

        setMessage('');
    }

    return ((user && Object.keys(user).length !== 0 && currentChatUser) ? (
        <>
            <div className="chat__meassages">
                {
                    messages.map(m => {
                        return <p className={m.from === user.email?"from-me":"from-them"}>{m.text}</p>
                    })
                }

            </div>
            <div className='chat__form'>
                <div className='chat__form_input'>
                    <input placeholder='Enter Message...' value={message} onChange={e => setMessage(e.target.value)} />
                </div>
                <div className='chat__form__button'>
                    <button type='click' onClick={e => sendMessage(e)}>
                        <SendRoundedIcon color="primary" />
                    </button>
                </div>

            </div>
        </>) : null
    )

}

export default Chat