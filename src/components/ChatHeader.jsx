import React from 'react'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

function ChatHeader({ currentChatUser, width, toggle, currentChatVisible }) {

    
    
    return <div className='chat__header'>
        {(width <= 856 && currentChatVisible) && <Button onClick={toggle}><ArrowBackIosIcon color='secondary' /></Button>}
        <Avatar className='chat__header__avatar' alt={currentChatUser.displayName} src={currentChatUser.photoURL} />
        <div className='checkListItem__name'>{currentChatUser.displayName}</div>

    </div>;
}

export default ChatHeader