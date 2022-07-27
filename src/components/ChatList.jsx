import React, { useState, useEffect } from 'react'
import { query, collection, onSnapshot} from 'firebase/firestore';
import {  db } from '../firebase';
import { UserAuth } from '../contexts/AuthContext'
import Avatar from '@mui/material/Avatar';


function ChatList({setCurrentChatUser,currentChatUser}) {
    

    const { user } = UserAuth();
    const [chatList, setChatList] = useState([])
    useEffect(() => {
        const q = query(collection(db, 'users'))

        const unsub = onSnapshot(q, (snapshot) => {
            setChatList(snapshot.docs.map(doc => (
                { ...doc.data(), id: doc.id }
            )
            ))
        })
        return () => unsub()
    }, [])
    // addToChatList=(e)=>{
    //     e.preventDefault();

    //     addDoc(collection(db, `chatsList/${user.email}/message`), {
    //         email:''
    //     })
    // }
    return (
        <>

            

                {chatList.filter(chat=>chat.email !== user.email).map(chat => {
                    return <a key={chat.id} onClick={e=>setCurrentChatUser(chat.email)}><div  
                    className={chat.email===currentChatUser?'checkListItem currentChatUser':'checkListItem'}>
                        <Avatar alt={chat.displayName} src={chat.photoURL} />
                        <div className='checkListItem__name'>{chat.displayName}</div>

                        </div></a>
                })}

            

        </>
    )
}

export default ChatList