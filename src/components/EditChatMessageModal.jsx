import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { Input } from '@mui/material';

import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import TextField from '@mui/material/TextField';
import { blue } from '@mui/material/colors';



const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function BasicModal({ message, editMessage, handleMenuClose }) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        handleMenuClose()
    }
    const [newMessage, setNewMessage] = React.useState(message.text);

    const handleEdit = (e) => {
        e.preventDefault();
        editMessage(message.id, newMessage)
        handleClose();
    }

    return (
        <div>
            <MenuItem onClick={handleOpen}>
                <ListItemIcon>
                    <EditIcon sx={{ color: blue[500] }}  fontSize="small" />
                </ListItemIcon>
                <Typography variant="inherit">Edit</Typography>
            </MenuItem>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <form onSubmit={handleEdit}>
                        <div className='form'>

                            <div className=''>
                                <Input fullWidth  variant="filled"  value={newMessage} onChange={e => setNewMessage(e.target.value)} type='text' />

                            </div>
                            <div>
                                <Button disabled={!newMessage} type='submit'>Update</Button>
                            </div>

                        </div>
                    </form>
                </Box>
            </Modal>
        </div>
    );
}
