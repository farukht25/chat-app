import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { Input } from '@mui/material';
import { FormLabel } from '@mui/material';

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

export default function BasicModal({ message ,editMessage,handleMenuClose}) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [newMessage, setNewMessage] = React.useState(message.text);

    const handleEdit=(e)=>{
        e.preventDefault();
        editMessage(message.id,newMessage)
        handleClose();
        handleMenuClose()
    }

    return (
        <div>
            <Button variant='text' onClick={handleOpen}>Edit</Button>
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
                                <Input value={newMessage} onChange={e=>setNewMessage(e.target.value)} type='text' />

                            </div>
                            <div>
                                <Button type='submit'>Update</Button>
                            </div>

                        </div>
                    </form>
                </Box>
            </Modal>
        </div>
    );
}
