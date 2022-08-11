import React, { useEffect, useState } from 'react'
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from '../firebase';
import CloseIcon from '@mui/icons-material/Close';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import Button from '@mui/material/Button';
import { red } from '@mui/material/colors';
import LinearProgress from '@mui/material/LinearProgress';

function ImagePreview({ setShowImagePreview, setImage, image, setUploadedImageURL, sendMessage, uploadedImageURL }) {

    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState('');

    useEffect(() => {
        if (progress === 100)
            setShowImagePreview(false)
    }, [progress])

    const handleClosePreview = (e) => {
        e.preventDefault();
        setImage(null);
        setCaption('')
        setShowImagePreview(false);
        
    }



    const handleMessageSend = async (e) => {
        e.preventDefault();

        if (!image) {
            setShowImagePreview(false);
            return
        }
        const sotrageRef = ref(storage, `files/${image.name}`);
        const uploadTask = uploadBytesResumable(sotrageRef, image);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const prog = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(prog);
            },
            (error) => console.log(error),
            () => {
                getDownloadURL(uploadTask.snapshot.ref)
                    .then((downloadURL) => {
                        sendMessage(e, downloadURL, caption)
                    });
            }

        )


    };

    return (
        <div>
            <button className='stylelessButton' onClick={e => handleClosePreview(e)}><CloseIcon sx={{ color: red[500] }} /></button>
            <div className='imagePreview__image__container'>
                <img className='imagePreview__image'
                    src={URL.createObjectURL(image)}
                    alt="preview"
                />

            </div>
            {(progress !== 0) && <div className='imagePreview__image__progress'>
                <LinearProgress variant="determinate" value={progress} style={{ width: '100%' }} />
            </div>}
            <form onSubmit={e => { handleMessageSend(e) }}>
                <div className='imagePreview__image__input'>
                    <input placeholder='Add Caption' type='text' value={caption} onChange={e => setCaption(e.target.value)} />
                </div>
                <div className='chat__form__button'>
                    <Button 
                        type='submit'
                        variant="dark"
                        disabled={progress>0 || !caption}
                        endIcon={<SendRoundedIcon color="dark" fontSize="large" />}
                    >
                        Send
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default ImagePreview