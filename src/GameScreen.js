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
    const neighborsAre = (neighbors) => {
        if (neighbors.every((neighbor) => neighbor.allegiance==='blue'|| neighbor.allegiance ==='solidBlue')) {
            return 'blue';
        }
        else if (neighbors.every((neighbor) => neighbor.allegiance==='red'|| neighbor.allegiance ==='solidRed')) {
            return 'red';
        }
        else {
            return '';
        }
    }
    const checkNeighbors = (block) => {
        const x = (otherBlock) => otherBlock.index%5;
        const y = (otherBlock) => Math.floor(otherBlock.index/5);
        const neighbors = blocks.filter((potentialNeighbor) => {
            const differenceY = Math.abs(y(potentialNeighbor)-y(block));
            const differenceX = Math.abs(x(potentialNeighbor)-x(block));
            return   ((x(potentialNeighbor) == x(block))&&(differenceY == 1)) || ((y(potentialNeighbor)==y(block))&&(differenceX == 1));
        }
        )
        const playerColor = turn===players[1]?'blue':'red';
        const solidColor = turn===players[1]?'solidBlue':'solidRed';
        const opponentColor = playerColor === 'red'?'blue':'red';
        const opponentSolidColor = playerColor === 'red'?'solidBlue':'solidRed';
        const neighborsColor = neighborsAre(neighbors);
        
        if(neighborsColor === playerColor && block.allegiance===playerColor){

          block.allegiance = solidColor;
          console.log(block);
        }
        else if (neighborsColor === '' && block.allegiance===opponentSolidColor) {
            block.allegiance = opponentColor;
        }
        return block;
    }
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
        const newBlocks = colorBlocks().map(checkNeighbors);
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