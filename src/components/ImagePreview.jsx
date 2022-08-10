import React, { useEffect, useState } from 'react'
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from '../firebase';
import CloseIcon from '@mui/icons-material/Close';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { red } from '@mui/material/colors';
import LinearProgress from '@mui/material/LinearProgress';

function ImagePreview({ setShowImagePreview, setImage, image, setUploadedImageURL, setMessage, sendMessage, message ,uploadedImageURL }) {

    const [progress, setProgress] = useState(0)
    const [fart, setFart] = useState('')

    useEffect(()=>{
        if(progress === 100)
        setShowImagePreview(false)
    },[progress])

    const handleClosePreview = (e) => {
        e.preventDefault();
        setShowImagePreview(false);
        setImage(null);
    }



    const handleMessageSend = (e) => {
        e.preventDefault();
        let url=''
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
                    if(!fart)setFart(downloadURL)
                    if(!url)url=downloadURL
                    if(!uploadedImageURL)setUploadedImageURL(prev=>downloadURL)
                    console.log("in state"+ uploadedImageURL+'just received'+downloadURL+'fart'+fart+'url'+url);
                    sendMessage(e)
                });
            }
        );
        console.log("in state"+ uploadedImageURL+'fart'+fart);
        
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
            <div className='imagePreview__image__progress'>
            <LinearProgress variant="determinate" value={progress} style={{width:'100%'}}/>
            </div>
            
            
            <div className='chat__form__button'>
                <Button onClick={e => { handleMessageSend(e) }}
                    type='submit'
                    variant="dark"
                    endIcon={<SendRoundedIcon color="dark" fontSize="large" />}
                >
                    Send
                </Button>
                


            </div>
        </div>
    )
}

export default ImagePreview