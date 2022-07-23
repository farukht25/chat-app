import Button from '@mui/material/Button';
import './App.css';
import React, { Component, useState } from "react";
import { AuthContextProvider } from './contexts/AuthContext';
import Header from './components/Header'
import Chat from './components/Chat';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import ChatList from './components/ChatList';
import userEvent from '@testing-library/user-event';
import {UserAuth} from './contexts/AuthContext'


function App() {
  const {user} = UserAuth();
  const[currentChatUser,setCurrentChatUser]=useState('')

  return (
    <div className="App">
        <Header />
        {user?
        <div className='container'>
          <div className="chatList"><ChatList setCurrentChatUser={setCurrentChatUser}/></div>
          <div className="currentChat"><Chat user={user} currentChatUser={currentChatUser}/></div>
        </div>
        :<p>loged out</p>}
    </div>
  );
}

export default App;
