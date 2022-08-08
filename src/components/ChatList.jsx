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
            if(chatItem.chatMetaData[emailWithoutPeriod])
            {
                return (chatItem.chatMetaData[emailWithoutPeriod]).substring(0, 10)+'...'
            }
            return ''
            
        
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
                    [1, 1, 1, 1, 1, 1].map(el => (

                        <div className='chatListItem'>
                            <Skeleton animation="wave" variant="circular" width={40} height={40} style={{ marginTop: 6 }} />
                            <div className='chatListItem__name'>

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

// function ChatListItem(userObj, setCurrentChatUser, currentChatUser, getLastMessage) {
//     return <button className='styleless__button' key={userObj.id} onClick={e => setCurrentChatUser({ email: userObj.email, photoURL: userObj.photoURL, displayName: userObj.displayName })}>
//         <div className={userObj.email === currentChatUser.email ? 'chatListItem currentChatUser' : 'chatListItem'}>
//             <Avatar alt={userObj.displayName} src={userObj.photoURL} />
//             <div>
//                 <div className='chatListItem__name'>{userObj.displayName}</div>
//                 <div className='chatListItem__preview'>{getLastMessage(userObj)}</div>
//             </div>
//         </div>
//     </button>;
// }
