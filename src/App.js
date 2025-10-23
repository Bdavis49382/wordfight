import './App.css';
import GameScreen from './GameScreen.js';
import React,{useState,useEffect} from 'react';
import LoginScreen from './LoginScreen';
import SelectionScreen from './SelectionScreen';
import Home from './Home';
import Rules from './Rules';
import {collection,onSnapshot,query, where, orderBy, or, Timestamp, and} from 'firebase/firestore';
import {db} from './firebase';
import { getAuth, onAuthStateChanged} from "firebase/auth";
const screenStyle = {
  backgroundColor:'rgb(212, 175, 97)',
  minHeight:'100vh',
  marginTop:0,
  color:'black'
}
function App() {
  const [user,setUser] = useState('');
  const [games,setGames] = useState([]);
  const[game,setGame] = useState({});
  const [gameId,setGameId] = useState('');
  const [screen,setScreen] = useState('home');
  const auth = getAuth();
  onAuthStateChanged(auth, (userAuth) => {
    if (userAuth && user === '') {
      const atSign = userAuth.email.indexOf("@")
      setUser(userAuth.email.slice(0,atSign).trim().toLowerCase());
      loadGames(userAuth.email.slice(0,atSign).trim().toLowerCase())
      setScreen('selection')
    } else if (user !== '' && userAuth === undefined) {
      setUser('')
      setScreen('home')
    }
  })
  
  const loadGames = (u) => {
    try {
      const yesterday = new Date()
      yesterday.setDate(new Date().getDate() - 1);
      const dayAgo = Timestamp.fromDate(yesterday)
      const q = query(collection(db,'games'), and(where("players", "array-contains", u), or(where("finished","==",false), where('lastMove','>=',dayAgo))), orderBy('lastMove','desc'))
      onSnapshot(q, (querySnapshot) => {
          const dbGames = [];
          querySnapshot.forEach((doc) => {
            dbGames.push({...doc.data(),id:doc.id})
          })
          setGames(dbGames);
      })
    }
    catch (e) {
      console.log(e)
      alert('unable to connect to firebase: ' + e);
    }

  }
  
  useEffect(() => {
    loadGames(user);
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
          setGame={setGame}
          gameId={gameId} 
          style={screenStyle}
          setGameId={setGameId} 
          setScreen={setScreen}
          />
      );
      case 'rules':
        return (
          <Rules style={screenStyle} setScreen={setScreen}></Rules>
        )
      default:
        return <p>Error: Didn't switch to an actual page.</p>
  }
}

export default App;
