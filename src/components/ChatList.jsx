import React, { useState, useEffect } from 'react'
import { query, collection, onSnapshot, orderBy, Timestamp, where } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { UserAuth } from '../contexts/AuthContext'
import Avatar from '@mui/material/Avatar';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';

function ChatList({setCurrentChatUser}) {
    

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
    return (
        <>

            

                {chatList.filter(chat=>chat.email !== user.email).map(chat => {
                    return <a onClick={e=>setCurrentChatUser(chat.email)}><div  className='checkListItem'>
                        <Avatar alt={chat.displayName} src={chat.photoURL} />
                        <div className='checkListItem__name'>{chat.displayName}</div>

                        </div></a>
                })}

            

        </>
    )
}

export default ChatList