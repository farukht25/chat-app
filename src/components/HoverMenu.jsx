import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditChatMessageModal from './EditChatMessageModal'
import EditChatMessageDialog from './EditChatMessageDialog'
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import { red } from '@mui/material/colors';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

export default function BasicMenu({ deleteMessage, messageId, message, editMessage, isUserMessage,setHoweredOnmessageId }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
        setHoweredOnmessageId(null)
    };
    const handleDelete = (e, justMe) => {
        deleteMessage(messageId, justMe);
        handleClose();

    }

    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
        },
    });

    return (
        
        <>

            <span className='chat__bubble__options'
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}

            >{<MoreVertIcon sx={{ fontSize: 15 }} />}
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

                {isUserMessage && <EditChatMessageDialog handleMenuClose={handleClose} message={message} editMessage={editMessage} />}
                <MenuItem onClick={e => handleDelete(e, true)}>
                    <ListItemIcon >
                        <DeleteIcon   sx={{ color: red[500] }} fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="inherit">Detete For Me</Typography>
                </MenuItem>
                {isUserMessage && (
                    <MenuItem onClick={e => handleDelete(e, false)}>
                        <ListItemIcon>
                            <DeleteIcon sx={{ color: red[500] }}  fontSize="small" />
                        </ListItemIcon>
                        <Typography variant="inherit">Detete For Everyone</Typography>
                    </MenuItem>)}
            </Menu>
        </>
    );
}
