// import React,{useState} from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import Form from './Form';
import './App.css';
function LoginScreen({setUser,setScreen,screen,style}) {
    const handleSubmit = async (event,newAccount) => {
        const auth = getAuth();
        event.preventDefault();
        const elements = event.target.elements;
        try{
          if (newAccount) {
            await createUserWithEmailAndPassword(auth,elements.username.value,elements.password.value);
          }
          else {
            await signInWithEmailAndPassword(auth,elements.username.value,elements.password.value);
          }
          const atSign = elements.username.value.indexOf("@")
          setUser(elements.username.value.slice(0,atSign));
          event.target.reset();
          setScreen('selection');

        }
        catch{
          alert("Incorrect username or password.")
        };

    }
    
  return (
    <div className="LoginScreen" style={style}>
      {screen === 'register'
      ?<Form handleSubmit={async (event) => await handleSubmit(event,true)} text="Register Here" />
      :<Form handleSubmit={async (event) => await handleSubmit(event,false)} text="Login here" />}
    </div>
  );
}
export default  LoginScreen;