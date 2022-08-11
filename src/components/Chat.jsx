import { query, collection, onSnapshot, orderBy, addDoc, updateDoc, getDoc, doc } from 'firebase/firestore';
import React, { useEffect, useState, useRef } from 'react'
import { db } from '../firebase';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { serverTimestamp } from "firebase/firestore";
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import ChatMessage from './ChatMessage';
import ChatHeader from './ChatHeader';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ImagePreview from './ImagePreview';

function Chat({ user, currentChatUser, width, toggle, currentChatVisible }) {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [howeredOnmessageId, setHoweredOnmessageId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [scroll, setScroll] = useState(true);
    const [image, setImage] = useState(null);
    const [showImagePreview, setShowImagePreview] = useState(false);
    const [uploadedImageURL, setUploadedImageURL] = useState('');
    const dummy = useRef();

    useEffect(() => {
        setLoading(true)
        if (currentChatUser.email) {

            const getAllMessages = async () => {
                const q = await query(collection(db, "chats", user.email, "messages"), orderBy('timestamp'));
                const unsub = onSnapshot(q, (snapshot) => {
                    let allMessages = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id, messageDate: formatDMY(doc.data().timestamp) }))
                    let newMessages = allMessages.filter(mes => {
                        return (mes.to === currentChatUser.email || mes.from === currentChatUser.email)
                    })
                    setMessages(newMessages)
                    setScroll(true)
                })
                setLoading(false)


                return () => unsub()
            }
            getAllMessages()


        }


    }, [user, currentChatUser])
    useEffect(() => {
        if (dummy.current && scroll) {
            dummy.current.scrollIntoView({ behaviour: 'smooth' })
            setReadReceits()
            setScroll(false)
        }
    }, [messages])

    const setReadReceits = () => {
        const unreadReceitMessages = messages.filter(message => {
            if ((message.seenBy).includes(user.email)) return false;
            else return true
        })
        let promiseArray = []
        try {
            unreadReceitMessages.forEach(message => {
                const newSeenArray = [...message.seenBy, user.email];
                promiseArray.push(updateDoc(doc(db, `chats/${currentChatUser.email}/messages`, message.copyId), { seenBy: newSeenArray }))
                promiseArray.push(updateDoc(doc(db, `chats/${user.email}/messages`, message.id), { seenBy: newSeenArray }))
            })
            Promise.all(promiseArray)
        }
        catch (err) {
            console.log(err)
        }
    }


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
            setScroll(false)
        }
        catch (error) {
            console.log(error)
        }
    }
    const editMessage = async (messageId, newMessage) => {
        try {

            const docSnap = await getDoc(doc(db, `chats/${user.email}/messages`, messageId));
            const copyMessageId = docSnap._document.data.value.mapValue.fields.copyId.stringValue
            await Promise.all([
                updateDoc(doc(db, `chats/${user.email}/messages`, messageId), { text: newMessage, isEdited: true }),
                updateDoc(doc(db, `chats/${currentChatUser.email}/messages`, copyMessageId), { text: newMessage, isEdited: true })
            ])
            setHoweredOnmessageId(null)
            setScroll(false)
        }
        catch (error) {
            console.log(error)
        }
    }
    const copyReference = async (receiverCopy, senderCopy, messageLocal) => {
        try {
            await Promise.all([
                updateDoc(doc(db, `chats/${user.email}/messages`, senderCopy), { copyId: receiverCopy }),
                updateDoc(doc(db, `chats/${currentChatUser.email}/messages`, receiverCopy), { copyId: senderCopy }),
                updateDoc(doc(db, `users`, currentChatUser.email), { [`chatMetaData.${(user.email).replace('.com', 'com')}`]: messageLocal }),
                updateDoc(doc(db, `users`, user.email), { [`chatMetaData.${(currentChatUser.email).replace('.com', 'com')}`]: messageLocal }),

            ])

        }
        catch (error) {
            console.log(error)
        }
    }

    const sendMessage = async (e,downloadURL,imageText) => {
        e.preventDefault();
        let messageLocal = message
        if(imageText) messageLocal=imageText
        setMessage('');
        try {
            if (true) {
                const [senderCopy, receiverCopy] = await Promise.all([
                    addDoc(collection(db, `chats/${user.email}/messages`), {
                        to: currentChatUser.email,
                        from: user.email,
                        timestamp: serverTimestamp(),
                        text: messageLocal,
                        isDeleted: false,
                        isEdited: false,
                        seenBy: [user.email],
                        imageURL:downloadURL

                    }),
                    addDoc(collection(db, `chats/${currentChatUser.email}/messages`), {
                        from: user.email,
                        to: currentChatUser.email,
                        timestamp: serverTimestamp(),
                        text: messageLocal,
                        isDeleted: false,
                        isEdited: false,
                        seenBy: [user.email],
                        imageURL:downloadURL
                    })])

                copyReference(receiverCopy._key.path.segments[3], senderCopy._key.path.segments[3], messageLocal)
                setScroll(true)
                setUploadedImageURL('')

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

    const handleUpload = (e) => {
        e.preventDefault()
        if (e.target.files[0]) {
            setImage(e.target.files[0])
            setShowImagePreview(true)
        }
    }

    if (showImagePreview){
        return <ImagePreview 
        setShowImagePreview={setShowImagePreview} 
        setImage={setImage} 
        setUploadedImageURL={setUploadedImageURL}
        setMessage={setMessage}
        sendMessage={sendMessage}
        message={message}
        uploadedImageURL={uploadedImageURL}
        image={image}/>
    }
        



    return ((currentChatUser.email) ? (

        <>
            <ChatHeader currentChatUser={currentChatUser} width={width} toggle={toggle} currentChatVisible={currentChatVisible} />
            <div className="chat__messages">

                {
                    (loading) ? (
                        <>
                            {[1, 2, 3, 4].map(el => (
                                <div key={el} className={(el%2 === 0) ? 'left' : 'right'}>
                                    
                                    <Skeleton animation="wave" variant="text" width={300} height={70} />
                                    <Skeleton  animation="wave" variant="text" width={100} height={70} />
                                </div>
                            ))}
                        </>

                    ) : (

                        messages.map((m, i, arr) => {
                            const previousItem = arr[i - 1];
                            var insertDate = false;
                            if (!previousItem ||                                           //when we are on 0th message
                                (previousItem && m.messageDate !== previousItem.messageDate))
                                insertDate = true


                            return (<>{insertDate && (<div className='message__date'>{m.messageDate}</div>)}
                                <ChatMessage m={m}
                                    user={user}
                                    key={m.id}
                                    currentChatUser={currentChatUser}
                                    setHoweredOnmessageId={setHoweredOnmessageId}
                                    howeredOnmessageId={howeredOnmessageId}
                                    editMessage={editMessage}
                                    dummy={dummy}
                                    deleteMessage={deleteMessage} /></>)

                        }))
                }
                <span ref={dummy}></span>
            </div>
            <form type='submit' onSubmit={e => sendMessage(e,'','')}>
                <div className='chat__form'>

                    <div className='chat__form_input'>

                        <label htmlFor='img-upload'><AttachFileIcon /></label>
                        <input className='chat__form_file__upload' id="img-upload" variant="filled" onChange={e => handleUpload(e)} type='file' accept='image/*' />
                        <input placeholder='Enter Message...' type='text' value={message} onChange={e => setMessage(e.target.value)} />
                    </div>
                    <div className='chat__form__button'>
                        <Button type='submit' disabled={!message} variant="dark" endIcon={<SendRoundedIcon color="dark" fontSize="large" />}>
                            Send
                        </Button>


                    </div>



                </div>
            </form>
        </>) : null
    )

}

export default Chat




