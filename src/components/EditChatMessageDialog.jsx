import React, { useEffect, useRef, useCallback } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { Input } from '@mui/material';

import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import { blue } from '@mui/material/colors';

export default function FormDialog({ message, editMessage, handleMenuClose }) {

    const [open, setOpen] = React.useState(false);
    const [newMessage, setNewMessage] = React.useState(message.text);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleEdit = (e) => {
        e.preventDefault();
        editMessage(message.id, newMessage)
        handleClose();
        handleMenuClose();
    }
    const autoFocus = useCallback(el => el ? el.focus() : null, [])

    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
        },
    });

    return (
            <div>
                <MenuItem onClick={handleClickOpen}>
                    <ListItemIcon>
                        <EditIcon sx={{ color: blue[500] }} fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="inherit">Edit</Typography>
                </MenuItem>
                <Dialog open={open} onClose={handleClose}>
                    <form onSubmit={handleEdit}>
                        <DialogTitle>Edit Message</DialogTitle>
                        <DialogContent>

                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                type="text"
                                fullWidth
                                variant="standard"
                                value={newMessage}
                                onChange={e => setNewMessage(e.target.value)}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} type='cancel'>Cancel</Button>
                            <Button type='submit'>Update</Button>
                        </DialogActions>
                    </form>
                </Dialog>
            </div>
    );
}
