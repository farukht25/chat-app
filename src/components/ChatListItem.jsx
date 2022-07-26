import React, { useEffect, useState } from 'react'
import Avatar from '@mui/material/Avatar';
import { query, collection, onSnapshot, where } from 'firebase/firestore';
import { db } from '../firebase';


function ChatListItem({ userObj, setCurrentChatUser, currentChatUser, getLastMessage, user }) {

    const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);


    useEffect(() => {
        const q = query(collection(db, "chats", user.email, "messages"), where('from', '==', userObj.email));
        const unsub = onSnapshot(q, (snapshot) => {
            let count = 0
            snapshot.docs.forEach(doc => {

                if (doc.data().seenBy.length === 1) count++;
            })

            setUnreadMessagesCount(count)

        })
        return () => unsub()
    }, [])

    return (
        <button className='stylelessButton' key={userObj.id} onClick={e => setCurrentChatUser({ email: userObj.email, photoURL: userObj.photoURL, displayName: userObj.displayName })}>
            <div  className={userObj.email === currentChatUser.email ? 'chatListItem currentChatUser' : 'chatListItem'}>
                <Avatar alt={userObj.displayName} src={userObj.photoURL} />
                <div>
                    <div className='chatListItem__name'>{userObj.displayName} </div>
                    <div className='chatListItem__preview'>{getLastMessage(userObj)}</div>
                </div>
                {unreadMessagesCount !== 0 && <span className='chatListItem__messageCount'>{unreadMessagesCount}</span>}
            </div>
        </button>
    )
}

export default ChatListItem