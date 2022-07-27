import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function BasicMenu({deleteMessage, messageId}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleDelete=()=>{
    handleClose();
    console.log('deleting '+messageId)
    deleteMessage(messageId);
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
        <MenuItem onClick={handleClose}>Edit</MenuItem>
        <MenuItem onClick={handleDelete}>Detete</MenuItem>
      </Menu>
    </>
  );
}
