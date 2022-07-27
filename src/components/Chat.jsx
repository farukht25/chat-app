import { query, collection, onSnapshot, orderBy, addDoc, updateDoc ,setDoc,getDoc} from 'firebase/firestore';
import React, { useEffect, useState, useRef } from 'react'
import { db } from '../firebase';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { serverTimestamp } from "firebase/firestore";
import Button from '@mui/material/Button';
import HoverMenu from '../components/HoverMenu'

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


    const deleteMessage = (messageId) => {
        try {
            console.log(`chats/${user.email}/messages/${messageId}`)
           console.log( getDoc(collection(db, `chats/${user.email}/messages/${messageId}`)))
            // const taskQuery = doc(collection(db, `chats/${user.email}/messages/${messageId}`))
            // const taskDocs = await getDocs(taskQuery)
            // taskDocs.forEach((taskDoc) => {
            //     await setDoc(taskDoc.ref, {
            //         name: 'prueba',
            //         uid: currentUser,
            //         projectId: newDocRef.id
            //     })
            // })
        }
        catch (error) {
            console.log(error)
        }
    }

    const sendMessage = (e) => {
        e.preventDefault();
        // sender
        if (message) {
            dummy.current.scrollIntoView({ behaviour: 'smooth' })

            addDoc(collection(db, `chats/${user.email}/messages`), {
                to: currentChatUser,
                from: user.email,
                timestamp: serverTimestamp(),
                text: message,
                isDeleted: false
            })
            console.log('enered 1')

            // receiver
            addDoc(collection(db, `chats/${currentChatUser}/messages`), {
                from: user.email,
                to: currentChatUser,
                timestamp: serverTimestamp(),
                text: message,
                isDeleted: false
            })
            console.log('enered2')

            setMessage('');
            dummy.current.scrollIntoView({ behaviour: 'smooth' })
        }
    }



    return ((user && Object.keys(user).length !== 0 && currentChatUser) ? (
        <>
            <div className="chat__meassages">

                {
                    messages.map(m => {
                        return (<>
                            <p key={m.id}
                                onMouseEnter={() => setHoweredOnmessageId(m.id)}
                                onMouseLeave={() => setHoweredOnmessageId(null)}
                                className={m.from === user.email ? "from-me" : "from-them"}> {m.text}
                                {(m.from === user.email && m.id === howeredOnmessageId) ? <HoverMenu deleteMessage={deleteMessage} messageId={m.id} /> : <span className='chat__menu__placeholder'> </span>}
                            </p>

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