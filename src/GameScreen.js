import React,{useEffect, useState} from 'react';
import './App.css';
import BlockGrid from './BlockGrid.js';
import {addDoc,setDoc, doc,collection} from 'firebase/firestore';
import {db} from './firebase';
function GameScreen({user,game,newGame,setGame}) {
  const [players,setPlayers] = useState(game.players);
  const [turn,setTurn] = useState(game.turn);
  const [word,setWord] = useState([]);
  const [usedWords,setUsedWords] = useState(game.usedWords);
  const [message,setMessage] = useState('Click on Letters to Form a Word!');
  const [blocks,setBlocks] = useState(game.blocks);
  const saveGame = () => {
      try {
        setDoc(doc(db,'games',game.id),{blocks,players,turn,usedWords})
      }
      catch {
        console.log('firebase error in setting document');
      }
  }
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
    else {
      setMessage('Waiting for your opponent...');
    }
    saveGame();
    
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
        {turn === user && <button onClick={endTurn}>Submit</button>}
        <h3>{message}</h3>
        {usedWords.length>0&&<h4>Last Word: {usedWords[usedWords.length-1].toLowerCase()}</h4>}
        <button onClick={() => setGame({})}>Back to Games</button>
    </div>
  );
}
export default  GameScreen;