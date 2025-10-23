import { useState} from 'react';
import './App.css';
import BlockGrid from './BlockGrid.js';
import Button from './Button';
import {submitWord} from './firebase';
const colors = {'solidBlue':'#0e75e3','blue':'#5ba3f0','none':'white','red':'#db4d4d','solidRed':'#d10d0d'}
function GameScreen({style,user,game,setGameId,gameId,setScreen,setGame}) {
  const [word,setWord] = useState([]);
  const [blocks,setBlocks] = useState(game.blocks);
  const over = game.scores[0] >= 10 || game.scores[1] >= 10
  const winner = game.scores[0] > game.scores[1] ? game.players[0] : game.players[1]
  const message = over ? (winner === user ? 'You Win' : 'You Lose') : (game.turn === user ? 'Click on Letters to Form a Word' : 'Waiting for your opponent...')

  const endTurn = async () => {
    if (word.length > 0) {
      try {
        const newGame = await submitWord({"word":word,"gameId":gameId})
        setWord([]);
        setGame(newGame.data)
        setBlocks(newGame.data.blocks)
      } catch (e) {
        alert(e.message.replace('FirebaseError: ',''))
      }
    } else {
      alert('No word was submitted!')
    }
  }

  return (
    <div className="GameScreen" style={style}>
      <h3 className='userName' style={{color:user === game.players[1]?colors.blue:colors.red}}>{user}</h3> 
      <h3 className='turn' style={{color:user === game.players[1]?colors.red:colors.blue}}>{game.players[0] === user ?game.players[1]:game.players[0]}</h3>
        <BlockGrid 
            turn={game.turn} 
            setWord={setWord} 
            user={user}
            blocks={blocks} 
            setBlocks={setBlocks} 
            players={game.players} 
            usedWords={game.usedWords}/>
        <div style={{width:'50%',margin:'10px auto'}}>
          <div style={{color:colors.blue,fontSize:'150%',float:user===game.players[1]?'left':'right'}}>{game.scores[1]}</div><div style={{color:colors.red,fontSize:'150%',textAlign:user===game.players[0]?'left':'right'}}>{game.scores[0]}</div>
        <h3 style={{textAlign:'center',color:'gray'}}>{message}</h3>
        </div>
        <h2 style={{textAlign:'center'}}>{word.map((block) => block.letter).join(' ')}</h2>
        <div style={{display:'flex',flexDirection:'row', justifyContent:'center'}}>
          {(game.turn === user && !over) && <Button onClick={endTurn} text="Submit"></Button>}
          <Button onClick={() => {setGameId('');setScreen('selection')}} text="Back to Games" style={{marginLeft:10}}/>
        </div>
        {game.usedWords.length>0&&<h4 style={{color:'gray'}}>Last Word: {game.usedWords[game.usedWords.length-1].toLowerCase()}</h4>}
    </div>
  );
}
export default  GameScreen;