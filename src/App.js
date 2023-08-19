import './App.css';
import GameScreen from './GameScreen.js';
import React,{useState,useEffect} from 'react';
import LoginScreen from './LoginScreen';
import SelectionScreen from './SelectionScreen';
import {db} from './firebase'
import {collection} from 'firebase/firestore';
function App() {
  const [user,setUser] = useState('');
  const [games,setGames] = useState([]);
  const[game,setGame] = useState({});
  // const gamesRef = collection(db,'games');
  // useEffect(() => {
  //   gamesRef
  //     .onSnapshot(
  //       querySnapshot => {
  //         const dbGames = [];
  //         querySnapshot.forEach((doc) => {
  //           dbGames.push(doc.data())
  //         })
  //         setGames(dbGames);
  //         console.log(dbGames);
  //       }
  //     )

  // },[])
  if(user !== ''){
    if (game !== {}) {
      return (
        <GameScreen user={user} />
      );
    }
    else {
      return (
        <SelectionScreen games={games} user= {user} setGame={setGame}/>
      )
    }
  }
  else {
    return (
      <LoginScreen setUser={setUser}/>
    );
  }
}

export default App;
