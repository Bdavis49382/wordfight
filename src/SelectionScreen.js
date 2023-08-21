import {addDoc,collection} from 'firebase/firestore';
import {db} from './firebase';
export default function SelectionScreen({games, user,setGame,setGameId}) {
//    console.log(user);
//    console.log(games); 
   const handleClick = (game) => {
    setGame(game);
    setGameId(game.id);
   }
    const buildNewGrid = () => {
        const newDice = ["AAEEGN","ELRTTY","AOOTTW","ABBJOO","EHRTVW","CIMOTU","DISTTY","EIOSST","DELRVY","ACHOPS","HIMNQU","EEINSU","EEGHNW","AFFKPS","HLNNRZ","DEILRX","AAEEGN","ACHOPS","AFFKPS","DEILRX","DELRVY","EEGHNW","EIOSST","HIMNQU","HLNNRZ",
          ];
          let shuffledDice = [];
          while (newDice.length > 0) {
            let randomDie = newDice.splice(Math.floor(Math.random() * newDice.length), 1);
        
            shuffledDice.push(randomDie);
          }
        
          let letters = shuffledDice.map((die) =>
            die[0].charAt(Math.floor(Math.random() * die[0].length))
          );
          return letters.map((letter,index) => ({
            index:index,
            letter:letter,
            allegiance:'none',
            clicked:false
        })); 
    }
  const createGame = async (game) => {
      try {
        const collectionReference = await addDoc(collection(db,'games'),{
                blocks:game.blocks,
                players:game.players,
                turn:game.turn,
                usedWords:game.usedWords,
                redScore:game.redScore,
                blueScore:game.blueScore
        })
        return collectionReference.id;
      }
      catch {
        console.log("firebase unsuccessful");
      }
  }
   const handleSubmit = async(event) => {
    event.preventDefault();
    const newGame = {
        id:'',
        blocks: buildNewGrid(),
        players: [user,event.target.elements.opponent.value],
        turn: user,
        usedWords: [],
        blueScore: 0,
        redScore: 0
    }
    newGame.id = await createGame(newGame);
    setGame(newGame);
    setGameId(newGame.id);

   }
    return (
        <div>
            <h1>Select a game</h1>
            <ul>
                {games
                    .filter(game => game.players.includes(user) && (game.redScore < 10 && game.blueScore < 10))
                    .map((game,index) => <li key={index} onClick={() => handleClick(game)}>{game.players[0]} vs {game.players[1]}  <b>{game.turn}'s turn</b></li>)}
            </ul>
            <form onSubmit={handleSubmit}>
                <h1>Or enter username of a friend to create game</h1>
                <input name="opponent" type="text" placeholder="opponent"/>
                <input type="submit"/>
            </form>


        </div>
    )
}