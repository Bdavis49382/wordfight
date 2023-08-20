import {addDoc,collection} from 'firebase/firestore';
import {db} from './firebase';
export default function SelectionScreen({games, user,setGame}) {
//    console.log(user);
//    console.log(games); 
   const handleClick = (game) => {
    setGame(game);
   }
  const createGame = (game) => {
      try {
        addDoc(collection(db,'games'),{
                blocks:game.blocks,
                players:game.players,
                turn:game.turn,
                usedWords:game.usedWords
    
        })
      }
      catch {
        console.log("firebase unsuccessful");
      }
  }
   const handleSubmit = (event) => {
    const newGame = {
        id:'',
        blocks: [],
        players: [user,event.target.elements.opponent.value],
        turn: user,
        usedWords: []
    }
    createGame(newGame);
    setGame(newGame);

   }
    return (
        <div>
            <h1>Select a game</h1>
            <ul>
                {games.filter(game => game.players.includes(user)).map((game,index) => <li key={index} onClick={() => handleClick(game)}>{game.players[0]} vs {game.players[1]}  <b>{game.turn}'s turn</b></li>)}
            </ul>
            <form onSubmit={handleSubmit}>
                <h1>Or enter username of a friend to create game</h1>
                <input name="opponent" type="text" placeholder="opponent"/>
            </form>


        </div>
    )
}