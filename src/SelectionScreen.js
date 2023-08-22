import {addDoc,collection} from 'firebase/firestore';
import {db} from './firebase';
import Game from './Game';
export default function SelectionScreen({games, user,setGame,setGameId,setScreen,style}) {
//    console.log(user);
//    console.log(games); 
   const handleClick = (game) => {
    setGame(game);
    setGameId(game.id);
    setScreen('game');
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
                blueScore:game.blueScore,
                lastMove:game.lastMove
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
        redScore: 0,
        lastMove:''
    }
    newGame.id = await createGame(newGame);
    setGame(newGame);
    setGameId(newGame.id);
    setScreen('game');

   }
   const formatDate = (game) => {
    if (game.lastMove === '') {
        return '';
    }
    const date = game.lastMove.toDate().getTime();
    const now = new Date().getTime();
    const minutes = Math.floor((now-date)/36000)
    if (minutes < 1) {
        return 'Last Move: just now';
    }
    if (minutes < 60) {
        return `Last Move: ${minutes} minutes ago`;
    }
    else if (minutes < 1440){
        return `Last Move: ${Math.floor(minutes/60)} hours, ${minutes%60} minutes ago`;
    }
    else {
        return `Last Move ${Math.floor(minutes/1440)} days, ${Math.floor((minutes%1440)/60)} hours, ${minutes %60} minutes ago`
    }
    // var time = date.toLocaleTimeString('en-US', { hour12: true });
    // return `Last Move: ${date.getMonth()}/${date.getDate()}/${date.getFullYear()} ${time}` 
   }
    return (
        <div style={style}>
            <div>{user}</div>
            <h1 style={{textAlign:'center'}}>Games</h1>
            <ul style={{padding:5}}>
                {games
                    .filter(game => game.players.includes(user) && (game.redScore < 10 && game.blueScore < 10))
                    .map((game,index) => <Game key={index} onClick={() => handleClick(game)} game={game} user={user} time={formatDate(game)}></Game>)
                    // .map((game,index) => <li className="game" key={index} onClick={() => handleClick(game)}>{game.players[0]} vs {game.players[1]}  <b>{game.turn}'s turn</b> {game.lastMove !== '' && <b>{formatDate(game)}</b>}</li>)}
                }
            </ul>
            <form onSubmit={handleSubmit}>
                <h1>Or enter username of a friend to create game</h1>
                <input name="opponent" type="text" placeholder="opponent"/>
                <input type="submit"/>
            </form>


        </div>
    )
}