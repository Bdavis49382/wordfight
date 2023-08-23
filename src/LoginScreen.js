// import React,{useState} from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import Form from './Form';
import './App.css';
import {db} from './firebase';
import Button from './Button';
import {addDoc,collection} from 'firebase/firestore';
function LoginScreen({setUser,setScreen,screen,style}) {
    const handleSubmit = async (event,newAccount) => {
        const auth = getAuth();
        event.preventDefault();
        const elements = event.target.elements;
        try{
          if (newAccount) {
            addDoc(collection(db,'players'), {name: elements.username.value.slice(0,elements.username.value.indexOf('@')).trim().toLowerCase()});
            await createUserWithEmailAndPassword(auth,elements.username.value.trim().toLowerCase(),elements.password.value.trim());
          }
          else {
            await signInWithEmailAndPassword(auth,elements.username.value.trim().toLowerCase(),elements.password.value.trim());
          }
          const atSign = elements.username.value.indexOf("@")
          setUser(elements.username.value.slice(0,atSign).trim().toLowerCase());
          event.target.reset();
          setScreen('selection');

        }
        catch{
          alert("Incorrect username or password.")
        };

    }
    
  return (
    <div className="LoginScreen" style={style}>
      <Button onClick={() => setScreen('home')} style={{float:'right'}} text="Home"/>
      {screen === 'register'
      ?<Form handleSubmit={async (event) => await handleSubmit(event,true)} text="Sign up" />
      :<Form handleSubmit={async (event) => await handleSubmit(event,false)} text="Login" />}
    </div>
  );
}
export default  LoginScreen;