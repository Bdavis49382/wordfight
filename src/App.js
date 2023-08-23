import './App.css';
import GameScreen from './GameScreen.js';
import React,{useState,useEffect} from 'react';
import LoginScreen from './LoginScreen';
import SelectionScreen from './SelectionScreen';
import Home from './Home';
import {collection,onSnapshot,query} from 'firebase/firestore';
import {db} from './firebase';
const screenStyle = {
  backgroundColor:'rgb(89, 10, 120)',
  height:'100vh',
  marginTop:0,
  color:'gray'
}
function App() {
  const [user,setUser] = useState('');
  const [games,setGames] = useState([]);
  const[game,setGame] = useState({});
  const [gameId,setGameId] = useState('');
  const [screen,setScreen] = useState('home');
  
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
  switch (screen) {
    case 'home':
      return <Home 
        setScreen={setScreen}
        style={screenStyle}
        />
    case 'login':
    case 'register':
      return (
        <LoginScreen 
          setScreen={setScreen}
          style={screenStyle}
          screen={screen}
          setUser={setUser}/>
      );
    case 'selection':
      return (
        <SelectionScreen 
          games={games}
          user= {user} 
          setGame={setGame}
          style={screenStyle}
          setScreen={setScreen}
          setGameId={setGameId}/>
      )
    case 'game':
      return (
        <GameScreen 
          user={user} 
          game={game} 
          gameId={gameId} 
          style={screenStyle}
          setGameId={setGameId} 
          setScreen={setScreen}
          />
      );
      default:
        return <p>Error: Didn't switch to an actual page.</p>
  }
}

export default App;
