import React, { useEffect } from 'react'
import {UserAuth} from '../contexts/AuthContext'
import Button from '@mui/material/Button';
import { auth,db } from '../firebase';
import { addDoc, collection } from 'firebase/firestore';
function Header() {
    const {  user,googleSignIn,logOut} = UserAuth();

    
  return (
    <div className='header'>
      <div className='header__logo'>Chat App</div>
      {user?
        <Button onClick={logOut}>Log Out</Button>:
        <Button onClick={googleSignIn}>Sign In</Button>
      }
        
    </div>
  )
}

export default Header