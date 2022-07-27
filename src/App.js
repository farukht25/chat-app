import './App.css';
import React, { useState } from "react";
import Header from './components/Header'
import Chat from './components/Chat';
import ChatList from './components/ChatList';
import { UserAuth } from './contexts/AuthContext'
import Paper from '@mui/material/Paper';


function App() {
  const { user } = UserAuth();
  const [currentChatUser, setCurrentChatUser] = useState('')

  return (
    <div className="App">
      <Header />

      <div className='container'>
        {user ? <>
          <div className="chatList"><ChatList setCurrentChatUser={setCurrentChatUser} currentChatUser={currentChatUser} /></div>
          <div className="currentChat"><Chat user={user} currentChatUser={currentChatUser} /></div></>
          : <><div className='logedOutScreen'>Loged Out. Please Sign Up / Sign In</div></>}

      </div>

    </div>
  );
}

export default App;
