import './App.css';
import GameScreen from './GameScreen.js';
import React,{useState,useEffect} from 'react';
import LoginScreen from './LoginScreen';
import SelectionScreen from './SelectionScreen';
import {doc, collection,onSnapshot,query,where} from 'firebase/firestore';
import {db} from './firebase';
function App() {
  const [user,setUser] = useState('');
  const [games,setGames] = useState([]);
  const[game,setGame] = useState({});
  const [ready,setReady] = useState(false);
  // const gamesRef = firebase.firestore().collection('games');
  const loadGames = () => {
    try {
      const q = query(collection(db,'games'))
      onSnapshot(q, (querySnapshot) => {
          const dbGames = [];
          querySnapshot.forEach((doc) => {
            dbGames.push({...doc.data(),id:doc.id})
          })
          setGames(dbGames);
      })
    }
    catch {
      alert('unable to connect to firebase');
    }

  }
  useEffect(() => {
    loadGames();
  },[])
  if(user !== ''){
    if (Object.keys(game).length !== 0) {
      return (
        <GameScreen user={user} game={game} newGame={games.filter((eachGame) => game.id === eachGame.id ).length === 0} setGame={setGame}/>
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
