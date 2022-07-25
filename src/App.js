import './App.css';
import React, {  useState } from "react";
import Header from './components/Header'
import Chat from './components/Chat';
import ChatList from './components/ChatList';
import {UserAuth} from './contexts/AuthContext'


function App() {
  const {user} = UserAuth();
  const[currentChatUser,setCurrentChatUser]=useState('')

  return (
    <div className="App">
        <Header />
        {user?
        <div className='container'>
          <div className="chatList"><ChatList setCurrentChatUser={setCurrentChatUser} currentChatUser={currentChatUser} /></div>
          <div className="currentChat"><Chat user={user} currentChatUser={currentChatUser}/></div>
        </div>
        :<p>loged out</p>}
    </div>
  );
}

export default App;
