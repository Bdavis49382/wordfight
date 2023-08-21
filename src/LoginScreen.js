// import React,{useState} from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import Form from './Form';
import './App.css';
function LoginScreen({setUser}) {
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

        }
        catch{
          alert("Incorrect username or password.")
        };

    }
    
  return (
    <div className="LoginScreen">
      <Form handleSubmit={async (event) => await handleSubmit(event,true)} text="First time? Enter your email and password here to register" />
      <Form handleSubmit={async (event) => await handleSubmit(event,false)} text="Already registered? Login here" />
        {/* <form onSubmit={handleSubmit}>
            <h1>Already registered? Login here.</h1>
            <input name="username" type="text" placeholder="email"/>
            <input name="password" type="password" placeholder="password"/>
            <input type="submit"/>
        </form> */}
    </div>
  );
}
export default  LoginScreen;