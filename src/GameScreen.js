import React,{useEffect, useState} from 'react';
import './App.css';
import BlockGrid from './BlockGrid.js';
import {getDoc,setDoc, updateDoc,doc,collection, onSnapshot} from 'firebase/firestore';
import {db} from './firebase';
function GameScreen({user,game,newGame,setGame,setGameId,gameId}) {
  const [players,setPlayers] = useState(game.players);
  const [turn,setTurn] = useState(game.turn);
  const [word,setWord] = useState([]);
  const [usedWords,setUsedWords] = useState(game.usedWords);
  const [message,setMessage] = useState('Click on Letters to Form a Word!');
  const [blocks,setBlocks] = useState(game.blocks);
  const loadGame = () => {
    onSnapshot(doc(db,'games',gameId), (doc) => {
      // console.log('loading game data:');
      // console.log(doc.data());
      // setGame(doc.data());
      setTurn(doc.data().turn);
      setUsedWords(doc.data().usedWords);
      setBlocks(doc.data().blocks);
    })
  }
  // const updateBlocks = async () => {
  //   const gameDoc = await getDoc(doc(db,'games',gameId));
  //   if (gameDoc.exists()) {
  //     setBlocks(gameDoc.data().blocks);
  //   }
  //   else {
  //     console.log('error updating blocks');
  //   }
  // }
  const saveGame = () => {
      try {
        setDoc(doc(db,'games',game.id),{blocks,players,turn,usedWords})
      }
      catch (err) {
        console.log('firebase error in setting document');
        console.log(err)
      }
  }
  const endTurn = async () => {
    const stringWord = word.map((block) => block.letter).join('')
    if(await verifyWord(stringWord)){
        await setUsedWords((prevUsedWords) => [...prevUsedWords,stringWord])
        setTurn((turn) => turn===players[0]?players[1]:players[0]);
        setWord([]);
        const newBlocks = colorBlocks();
        updateDoc(doc(db,'games',gameId), {"blocks":newBlocks})
    }
    else {
        setMessage('That was not a valid word');
    }
    
  }

  const colorBlocks = () => {
    const newBlocks = blocks.map((block) => {
      const playerColor = turn===players[1]?'blue':'red';
      if (block.clicked) {
        block.allegiance = playerColor;
        block.clicked = false;
      }
      return block;
    })
    return newBlocks;
  }
  // useEffect(() => {
  //   updateBlocks();
  // },[usedWords]);
  // useEffect(() => {
  //   saveGame();
  //   console.log('game saved');
  // },[blocks])
  useEffect(() => {
    loadGame();
  },[])
  useEffect(() => {
    if(turn === user){
      // updateBlocks();
        setMessage('Click on Letters to Form a Word');
    }
    else {
      saveGame();
      setMessage('Waiting for your opponent...');
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
      <h3 className='userName' style={{color:user === players[1]?'blue':'red'}}>{user}</h3> 
      <h3 className='turn' >{turn === user ?"Your Turn":"Your Opponents Turn"}</h3>
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
        <button onClick={() => setGameId('')}>Back to Games</button>
    </div>
  );
}
export default  GameScreen;