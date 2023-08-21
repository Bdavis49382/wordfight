import React,{useEffect, useState} from 'react';
import './App.css';
import BlockGrid from './BlockGrid.js';
import {setDoc, updateDoc,doc, onSnapshot, serverTimestamp} from 'firebase/firestore';
import {db} from './firebase';
function GameScreen({user,game,setGameId,gameId}) {
  const [players,setPlayers] = useState(game.players);
  const [turn,setTurn] = useState(game.turn);
  const [word,setWord] = useState([]);
  const [usedWords,setUsedWords] = useState(game.usedWords);
  const [message,setMessage] = useState('Click on Letters to Form a Word!');
  const [blocks,setBlocks] = useState(game.blocks);
  const [blueScore,setBlueScore] = useState(game.blueScore);
  const [redScore,setRedScore] = useState(game.redScore);
  // const [over,setOver] = useState(false);
  const loadGame = () => {
    onSnapshot(doc(db,'games',gameId), (doc) => {
      setTurn(doc.data().turn);
      setUsedWords(doc.data().usedWords);
      setBlocks(doc.data().blocks);
      setBlueScore(doc.data().blueScore);
      setRedScore(doc.data().redScore);
    })
  }
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
            return   ((x(potentialNeighbor) === x(block))&&(differenceY === 1)) || ((y(potentialNeighbor)===y(block))&&(differenceX === 1));
        }
        )
        const playerColor = turn===players[1]?'blue':'red';
        const solidColor = turn===players[1]?'solidBlue':'solidRed';
        const opponentColor = playerColor === 'red'?'blue':'red';
        const opponentSolidColor = playerColor === 'red'?'solidBlue':'solidRed';
        const neighborsColor = neighborsAre(neighbors);
        
        if(neighborsColor === playerColor && block.allegiance===playerColor){
          block.allegiance = solidColor;
          if (playerColor === 'blue') {
            setBlueScore((score) => score + 1);
          }
          else {
            setRedScore((score) => score + 1);
          }
        }
        else if ((neighborsColor === '' || neighborsColor === playerColor) && block.allegiance===opponentSolidColor) {
            block.allegiance = opponentColor;
            if (playerColor === 'blue') {
              setRedScore((score) => score -1);
            }
            else {
              setBlueScore((score) => score - 1);
            }
        }
        return block;
    }
  const saveGame = () => {
      try {
        updateDoc(doc(db,'games',game.id),{blocks,players,turn,usedWords,blueScore,redScore})
      }
      catch (err) {
        console.log('firebase error in setting document');
      }
  }
  const endTurn = async () => {
    const stringWord = word.map((block) => block.letter).join('')
    if(await verifyWord(stringWord)){
        await setUsedWords((prevUsedWords) => [...prevUsedWords,stringWord])
        setTurn((turn) => turn===players[0]?players[1]:players[0]);
        setWord([]);
        const newBlocks = colorBlocks().map(checkNeighbors);
        updateDoc(doc(db,'games',gameId), {"blocks":newBlocks,'lastMove':serverTimestamp()})
        
    }
    else {
        setMessage('That was not a valid word');
    }
    
  }

  const colorBlocks = () => {

    const solidEnemyColor = turn===players[1]?'solidRed':'solidBlue';
    const newBlocks = blocks.map((block) => {
      const playerColor = turn===players[1]?'blue':'red';
      if (block.clicked && block.allegiance !== solidEnemyColor) {
        block.allegiance = playerColor;
      }
      block.clicked = false;
      return block;
    })
    return newBlocks;
  }
  useEffect(() => {
    loadGame();
  },[])
  useEffect(() => {
    if (redScore >= 10 || blueScore >= 10) {
      setMessage('Game Over');
    }
    else if(turn === user){
        setMessage('Click on Letters to Form a Word');
    }
    else {
      saveGame();
      setMessage('Waiting for your opponent...');
    }
    
  },[turn,user])
  async function verifyWord(word) {
    
    let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    const response = await fetch(url);
    if (response.ok) {
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
        {(turn === user && blueScore < 10 && redScore < 10) && <button onClick={endTurn}>Submit</button>}
        <h3>{message}</h3>
        {usedWords.length>0&&<h4>Last Word: {usedWords[usedWords.length-1].toLowerCase()}</h4>}
        <button onClick={() => setGameId('')}>Back to Games</button>
        <p>Score</p>
        <p style={{color:'blue'}}>{blueScore}</p>
        <p style={{color:'red'}}>{redScore}</p>
        <p>{redScore>=10?"red won":""}</p>
        <p>{blueScore>=10?"blue won":""}</p>
    </div>
  );
}
export default  GameScreen;