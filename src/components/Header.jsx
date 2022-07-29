import React from 'react'
import {UserAuth} from '../contexts/AuthContext'
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
function Header() {
    const {  user,googleSignIn,logOut} = UserAuth();

    
  return (
    <div className='header'>
      <div className='header__logo'>Chat App</div>
      {user?
        // <Button  onClick={logOut}>Log Out</Button>
        <IconButton aria-label="logout"  color="secondary"   onClick={logOut}>
        <LogoutIcon  variant='secondary' />
      </IconButton>
        :<Button onClick={googleSignIn}>Sign Up/Sign In</Button>
      }
        
    </div>
  )
}

export default Header