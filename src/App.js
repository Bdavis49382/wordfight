import './App.css';
import GameScreen from './GameScreen.js';
import React,{useState,useEffect} from 'react';
import LoginScreen from './LoginScreen';
import SelectionScreen from './SelectionScreen';
import Home from './Home';
import Rules from './Rules';
import {collection,doc,deleteDoc,onSnapshot,query} from 'firebase/firestore';
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
      setScreen('selection')
    } else if (user !== '' && userAuth === undefined) {
      setUser('')
      setScreen('home')
    }
    console.log('user is logged in: ',user)
  })
  
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
  const removeOldGames = () => {
    games.forEach(game => {
      if (game.lastMove == null) {
        console.log('cannot delete game, null lastMove')
        return;
      }
      const lastMove = game.lastMove.toDate().getTime();
      const now = new Date();
      const minutes = Math.floor((now-lastMove)/60000)
      if (minutes > 1440 && (game.redScore >= 10 || game.blueScore >= 10)) {
        deleteDoc(doc(db,'games',game.id));
        console.log('deleting ',game)
      }
    })
  }
  
  useEffect(() => {
    loadGames();
  },[])
  useEffect(() => {
    removeOldGames();
  },[games])
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
      case 'rules':
        return (
          <Rules style={screenStyle} setScreen={setScreen}></Rules>
        )
      default:
        return <p>Error: Didn't switch to an actual page.</p>
  }
}

export default App;
