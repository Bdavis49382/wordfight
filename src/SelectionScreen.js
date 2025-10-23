import {collection,getDocs,query} from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';
import {useState,useEffect} from 'react';
import {db} from './firebase';
import Game from './Game';
import Button from './Button';
import { createGame } from './firebase';

export default function SelectionScreen({games, user, setGame,setGameId,setScreen,style}) {
    const [players,setPlayers] = useState([]);
    const auth = getAuth()
   const handleClick = (game) => {
    setGame(game);
    setGameId(game.id);
    setScreen('game');
   }
    const getPlayers = async () => {
        const q = query(collection(db,'players'));
        const querySnapshot = await getDocs(q);
        setPlayers(querySnapshot.docs.map(doc => {return {...doc.data(),id:doc.id}}).filter(doc => doc.name !== user));
    }
    useEffect(() => {
        getPlayers();
    },[])
  const findClosest = (wordArray,targetWord) => {
    const samenessScores = wordArray.map(word => {
        let sameness = 0;
        for (let i=0;i<word.length;i++) {
            if (i < targetWord.length && word.charAt(i) === targetWord.charAt(i)) {
                sameness++;
            }
        }
        return sameness;
    })
    let highest = 0;
    samenessScores.forEach((score,index) => {
        if (score > samenessScores[highest]) {
            highest = index;
        }
    })
    return wordArray[highest];
  }
   const handleSubmit = async(event) => {
    event.preventDefault();
    let opponent = event.target.elements.opponent.value.trim().toLowerCase();
    if (opponent === '') {
        return;
    }
    if (opponent.includes('@')) {
       opponent = opponent.slice(0,opponent.indexOf('@')); 
    }
    if (players.filter(player => player.name === opponent).length === 0) {
        const names = players.map(player => player.name);
        alert('There is no account under the username ' + opponent + '. Perhaps you meant: ' + findClosest(names,opponent))
        return;
    }
    try {
        const newGame = await createGame({user,opponent}) 
        setGame(newGame.data);
        setGameId(newGame.data.id);
        setScreen('game');
    } catch (e) {
        console.error(`Firebase failed in creating a new game: ${e.message}, ${e.details}`)
    }

   }
   const formatDate = (game) => {
    if (game.lastMove ===null) {
        return '';
    }
    const date = game.lastMove.toDate().getTime();
    const now = new Date().getTime();
    const minutes = Math.floor((now-date)/60000)
    if (minutes < 1) {
        return 'just now';
    }
    if (minutes < 60) {
        return `${minutes} minutes ago`;
    }
    else if (minutes < 1440){
        return `${Math.floor(minutes/60)} hours, ${minutes%60} minutes ago`;
    }
    else {
        return `${Math.floor(minutes/1440)} days, ${Math.floor((minutes%1440)/60)} hours, ${minutes %60} minutes ago`
    }
    // var time = date.toLocaleTimeString('en-US', { hour12: true });
    // return `Last Move: ${date.getMonth()}/${date.getDate()}/${date.getFullYear()} ${time}` 
   }
    return (
        <div style={style}>
            <Button onClick={() => {
                setScreen('home');
                signOut(auth);
            }}text="Log out" style={{float:'right'}}></Button>
            <div>{user}</div>
            <h1 style={{textAlign:'center'}}>Games</h1>
            <ul style={{padding:5}}>
                {games
                    .map((game,index) => <Game key={index} onClick={() => handleClick(game)} game={game} user={user} time={formatDate(game)}></Game>)
                }
            </ul>
            <form onSubmit={handleSubmit}>
                <h1>Start New Game</h1>
                <select name="opponent">
                    <option value="">Choose Opponent</option>
                    {players.map(player => <option key={player.id} value={player.name}>{player.name}</option>)}
                </select>
                {/* <input name="opponent" type="text" placeholder="opponent"/> */}
                <input type="submit"/>
            </form>
        </div>
    )
}