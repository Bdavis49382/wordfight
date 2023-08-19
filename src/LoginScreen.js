import React,{useState} from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import './App.css';
function LoginScreen({setUser}) {
    const handleSubmit = (event) => {
        const auth = getAuth();
        event.preventDefault();
        const elements = event.target.elements;
        signInWithEmailAndPassword(auth,elements.username.value,elements.password.value).then(() => {
          const atSign = elements.username.value.indexOf("@")
          console.log(elements.username.value);
          setUser(elements.username.value.slice(0,atSign));
          event.target.reset();

        }).catch(() => {
          alert("Incorrect username or password.")
        });
        // console.log(event.target.elements.password.value);
    }
  return (
    <div className="LoginScreen">
        <form onSubmit={handleSubmit}>
            <h1>Enter Username Here</h1>
            <input name="username" type="text" placeholder="email"/>
            <input name="password" type="password" placeholder="password"/>
            <input type="submit"/>
        </form>
    </div>
  );
}
export default  LoginScreen;