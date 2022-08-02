import React, { useState, useEffect } from 'react'
import { query, collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { UserAuth } from '../contexts/AuthContext'
import Avatar from '@mui/material/Avatar';
import Skeleton from '@mui/material/Skeleton';

function ChatList({ setCurrentChatUser, currentChatUser }) {


    const { user } = UserAuth();
    const [chatList, setChatList] = useState([])
    useEffect(() => {
        const getChatUserList = async () => {
            try {
                const q = query(collection(db, 'users'))

                const unsub = await onSnapshot(q, (snapshot) => {
                    setChatList(snapshot.docs.map(doc => (
                        { ...doc.data(), id: doc.id }
                    )
                    ))
                })
                return () => unsub()
            }
            catch (error) {
                console.log(error)
            }
        }
        getChatUserList()
    }, [])



    return ((chatList.length !== 0) ? (

        <>
            {chatList.filter(chat => chat.email !== user.email).map(chat => {
                return <a key={chat.id} onClick={e => setCurrentChatUser({ email: chat.email, photoURL: chat.photoURL, displayName: chat.displayName })}>
                    <div className={chat.email === currentChatUser.email ? 'checkListItem currentChatUser' : 'checkListItem'}>
                        <Avatar alt={chat.displayName} src={chat.photoURL} />
                        <div className='checkListItem__name'>{chat.displayName}</div>

                    </div></a>
            })}
        </>) : (
        <>
            {
                [1, 1, 1, 1, 1, 1].map(el => (

                    <div className='checkListItem'>
                        <Skeleton animation="wave" variant="circular" width={40} height={40} style={{ marginTop: 6 }} />
                        <div className='checkListItem__name'>

                            <Skeleton
                                animation="wave"
                                height={20}
                                width={150}
                            />
                        </div>

                    </div>
                ))
            }

        </>
    )
    )
}

export default ChatList