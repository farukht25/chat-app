import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditChatMessageModal from './EditChatMessageModal'

export default function BasicMenu({deleteMessage, messageId,message,editMessage}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleDelete=()=>{
    deleteMessage(messageId);
    handleClose();
    
  }
  
  return (
    <>
      <span className='chat__bubble__options'
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        
      >{<MoreVertIcon sx={{ fontSize: 12 }}/>}
      </span>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <EditChatMessageModal handleMenuClose={handleClose} message={message} editMessage={editMessage} ><MenuItem >Edit</MenuItem></EditChatMessageModal>
        <MenuItem onClick={handleDelete}>Detete</MenuItem>
      </Menu>
    </>
  );
}
