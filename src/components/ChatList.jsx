import React, { useState, useEffect } from 'react'
import { query, collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { UserAuth } from '../contexts/AuthContext'

import Skeleton from '@mui/material/Skeleton';
import ChatListItem from './ChatListItem';

function ChatList({ setCurrentChatUser, currentChatUser }) {


    const { user } = UserAuth();
    const [chatList, setChatList] = useState([])
    useEffect(() => {
        const getChatUserList = async () => {
            try {
                const usersQuery = query(collection(db, 'users'))

                const unsub = await onSnapshot(usersQuery, (snapshot) => {
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
    const getLastMessage = (chatItem) => {
        let emailWithoutPeriod = (user.email).replace('.com', 'com');
        let lastMessage = chatItem.chatMetaData[emailWithoutPeriod]
        if (!lastMessage) return ''
        if (lastMessage.length <= 14) return lastMessage
        return lastMessage.substring(0, 11) + '...'
    }



    return (
        (chatList.length !== 0) ? (

            <>
                {chatList.filter(chat => chat.email !== user.email).map(userObj => {
                    return <ChatListItem
                        userObj={userObj}
                        setCurrentChatUser={setCurrentChatUser}
                        currentChatUser={currentChatUser}
                        getLastMessage={getLastMessage}
                        user={user}
                    />
                })

                }
            </>) : (
            <>
                {
                    [1, 2, 3, 4, 5, 6].map(el => (

                        <div key={el} className='chatListItem'>
                            <Skeleton animation="wave" variant="circular" width={40} height={40} style={{ marginTop: 6 }} />
                            <div>
                                <div className='chatListItem__name'>

                                    <Skeleton
                                        animation="wave"
                                        height={20}
                                        width={200}
                                    />

                                </div>
                                <div className='chatListItem__preview'>
                                    <Skeleton
                                        animation="wave"
                                        height={20}
                                        width={150}
                                    />
                                </div>
                            </div>
                        </div>
                    ))
                }

            </>
        )
    )
}

export default ChatList


