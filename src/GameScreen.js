import React,{useEffect, useState} from 'react';
import './App.css';
import BlockGrid from './BlockGrid.js';
import { db} from './firebase.js';
import { collection , onSnapshot , serverTimestamp, addDoc, query, orderBy} from 'firebase/firestore';

const q=query(collection(db,'games'),orderBy('turn','desc'));
function GameScreen({user}) {
  const players = ['Bdude493','Mouseymama']
  const [turn,setTurn] = useState(user);
  const [word,setWord] = useState([]);
  const [usedWords,setUsedWords] = useState([]);
  const [message,setMessage] = useState('Click on Letters to Form a Word!');
  const [blocks,setBlocks] = useState([]);
  const endTurn = async () => {
    const stringWord = word.map((block) => block.letter).join('')
    if(await verifyWord(stringWord)){
        setTurn((turn) => turn===players[0]?players[1]:players[0]);
        setUsedWords((prevUsedWords) => [...prevUsedWords,stringWord])
        setWord([]);

    }
    else {
        setMessage('That was not a valid word');
    }
    
  }
  useEffect(() => {
    if(turn === user){

        setMessage('Click on Letters to Form a Word');
    }
    
  },[turn])
  async function verifyWord(word) {
    
    let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    const response = await fetch(url);
    if (response.ok) {
        // const data = await response.json();
        return true
    }
    else {
        return false
    }
  }
  return (
    <div className="GameScreen">
      <h3 className='userName'>{user}</h3> 
      <h3 className='turn'>{turn === user ?"Your Turn":"Your Opponents Turn"}</h3>
        <BlockGrid 
            turn={turn} 
            setWord={setWord} 
            blocks={blocks} 
            setBlocks={setBlocks} 
            players={players} 
            usedWords={usedWords}/>
        <h2>{word.map((block) => block.letter).join(' ')}</h2>
        <button onClick={endTurn}>Submit</button>
        <h3>{message}</h3>
    </div>
  );
}
export default  GameScreen;