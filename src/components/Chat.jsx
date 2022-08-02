import { query, collection, onSnapshot, orderBy, addDoc, updateDoc, getDoc, doc } from 'firebase/firestore';
import React, { useEffect, useState, useRef } from 'react'
import { db } from '../firebase';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { serverTimestamp } from "firebase/firestore";
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import ChatMessage from './ChatMessage';
import ChatHeader from './ChatHeader';

function Chat({ user, currentChatUser ,width,toggle,currentChatVisible}) {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [howeredOnmessageId, setHoweredOnmessageId] = useState(null);
    const dummy = useRef()
    useEffect(() => {

        if (user && Object.keys(user).length !== 0 && currentChatUser.email) {


            const q = query(collection(db, "chats", user.email, "messages"), orderBy('timestamp'));
            const unsub = onSnapshot(q, (snapshot) => {
                let allMessages = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id, messageDate: formatDMY(doc.data().timestamp) }))
                let newMessages = allMessages.filter(mes => {
                    return (mes.to === currentChatUser.email || mes.from === currentChatUser.email)
                })
                setMessages(prev => newMessages)
            })
            return () => unsub()
            
        }
    }, [user, currentChatUser])


    const deleteMessage = async (messageId, justMe) => {
        try {
            const docSnap = await getDoc(doc(db, `chats/${user.email}/messages`, messageId));
            const copyMessageId = docSnap._document.data.value.mapValue.fields.copyId.stringValue
            if (justMe) {
                updateDoc(doc(db, `chats/${user.email}/messages`, messageId), { isDeleted: true })
            }
            else {
                await Promise.all([
                    updateDoc(doc(db, `chats/${user.email}/messages`, messageId), { isDeleted: true }),
                    updateDoc(doc(db, `chats/${currentChatUser.email}/messages`, copyMessageId), { isDeleted: true })
                ])
            }

            setHoweredOnmessageId(null)
        }
        catch (error) {
            console.log(error)
        }
    }
    const editMessage = async (messageId, newMessage) => {
        try {
            console.log('edit func' + messageId)

            const docSnap = await getDoc(doc(db, `chats/${user.email}/messages`, messageId));
            const copyMessageId = docSnap._document.data.value.mapValue.fields.copyId.stringValue
            await Promise.all([
                updateDoc(doc(db, `chats/${user.email}/messages`, messageId), { text: newMessage, isEdited: true }),
                updateDoc(doc(db, `chats/${currentChatUser.email}/messages`, copyMessageId), { text: newMessage, isEdited: true })
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
                updateDoc(doc(db, `chats/${currentChatUser.email}/messages`, receiverCopy), { copyId: senderCopy })
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
                        to: currentChatUser.email,
                        from: user.email,
                        timestamp: serverTimestamp(),
                        text: messageLocal,
                        isDeleted: false,
                        isEdited: false
                    }),
                    addDoc(collection(db, `chats/${currentChatUser.email}/messages`), {
                        from: user.email,
                        to: currentChatUser.email,
                        timestamp: serverTimestamp(),
                        text: messageLocal,
                        isDeleted: false,
                        isEdited: false
                    })])

                copyReference(receiverCopy._key.path.segments[3], senderCopy._key.path.segments[3])

                dummy.current.scrollIntoView({ behaviour: 'smooth' })
            }
        }
        catch (error) { console.log(error) }
    }

    function formatDMY(messageTimestamp) {
        if (!messageTimestamp) return '';
        var today = new Date();
        var yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (messageTimestamp.toDate().toISOString().substr(0, 10) === today.toISOString().substr(0, 10))
            return 'Today'
        if (messageTimestamp.toDate().toISOString().substr(0, 10) === yesterday.toISOString().substr(0, 10))
            return 'Yesterday'

        messageTimestamp = messageTimestamp.toDate();
        return ('0' + messageTimestamp.getDate()).slice(-2) + '/' +
            ('0' + (messageTimestamp.getMonth() + 1)).slice(-2) + '/' +
            ('000' + messageTimestamp.getFullYear()).slice(-4);
    }


    return ((user && Object.keys(user).length !== 0 && currentChatUser.email) ? (
        <>
            <ChatHeader currentChatUser={currentChatUser} width={width} toggle={toggle} currentChatVisible={currentChatVisible}/>
            <div className="chat__meassages">

                {   
                    messages.length!==0?(
                    messages.map((m, i, arr) => {
                        const previousItem = arr[i - 1];
                        var insertDate = false;
                        if (!previousItem ||                                           //when we are on 0th message
                            (previousItem && m.messageDate !== previousItem.messageDate))
                            insertDate = true


                        return (<>{insertDate && (<div className='message__date'>{m.messageDate}</div>)}<ChatMessage m={m} user={user}
                            setHoweredOnmessageId={setHoweredOnmessageId}
                            howeredOnmessageId={howeredOnmessageId} editMessage={editMessage} deleteMessage={deleteMessage} /></>)

                    })
                    ):(
                    <>
                    {[1,2,1,2].map(el=>(
                        <div className={el===1?'left':'right'}>
                            <Skeleton animation="wave" variant="text" width={100} height={70} />
                        </div>
                    ))}
                    </>)
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




