import './App.css';
import React, { useEffect, useState } from "react";
import Header from './components/Header'
import Chat from './components/Chat';
import ChatList from './components/ChatList';
import { UserAuth } from './contexts/AuthContext'
import windowDimensions from '../src/hooks/useWindowDimentions'

function App() {
  const { user } = UserAuth();
  const [currentChatUser, setCurrentChatUser] = useState({
    email:'',
    photoLink:'',
    displayName:''
  })
  const { height, width } = windowDimensions();
  const [chatListVisible, setChatListVisible] = useState(true)
  const [currentChatVisible, setCurrentChatVisible] = useState(true)
  console.log(width)


  useEffect(() => {
    console.log('list:' + chatListVisible + 'current' + chatListVisible)
    if (width > 856) {
      setChatListVisible(true)
      setCurrentChatVisible(true)
      return
    }
    if (width <= 856 && currentChatUser.email) {
      setChatListVisible(false)
      setCurrentChatVisible(true)
    }
    else {
      setChatListVisible(true)
      setCurrentChatVisible(false)
    }
  }, [height, width, currentChatUser])

  const toggle = () => {
    let cur = chatListVisible
    setChatListVisible(!cur)
    setCurrentChatVisible(cur)
  }




  return (
    <div className="App">
      <Header/>
      <div className='container'>
        {user ?
          <>
            {chatListVisible && <div className="chatList"><ChatList setCurrentChatUser={setCurrentChatUser} currentChatUser={currentChatUser} /></div>}
            {currentChatVisible && <div className="currentChat"><Chat user={user} currentChatUser={currentChatUser}
            width={width}
            toggle={toggle}
            currentChatVisible={currentChatVisible} 
            /></div>}
          </>
          :
          <>
            <div className='logedOutScreen'>Loged Out. Please Sign Up / Sign In</div>
          </>}

      </div>

    </div>
  );
}

export default App;
