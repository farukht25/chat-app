import React,{ useContext, createContext, useEffect, useState } from 'react';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth,db } from '../firebase';
import { getAdditionalUserInfo } from "firebase/auth";
import { addDoc, collection} from 'firebase/firestore';
import { serverTimestamp } from "firebase/firestore";


const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({});

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
    .then((result)=>{
    const { isNewUser } = getAdditionalUserInfo(result)
    if(isNewUser) addDoc(collection(db,'users'),{email:result.user.email,uid:result.user.uid, timestamp: serverTimestamp(),displayName:result.user.displayName,
      photoURL:result.user.photoURL})
    }).catch(err=>console.log(err))
  };

  const logOut = () => {
      signOut(auth)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      
    })
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ googleSignIn, logOut, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};