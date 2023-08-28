import {addDoc,collection,getDocs,query,serverTimestamp} from 'firebase/firestore';
import {useState,useEffect} from 'react';
import {db} from './firebase';
import Game from './Game';
import Button from './Button';
export default function SelectionScreen({games, user, setGame,setGameId,setScreen,style}) {
    const [players,setPlayers] = useState([]);
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
    const getPlayers = async () => {
        const q = query(collection(db,'players'));
        const querySnapshot = await getDocs(q);
        setPlayers(querySnapshot.docs.map(doc => doc.data()).filter(doc => doc.name !== user));
    }
    useEffect(() => {
        getPlayers();
    },[])
  const createGame = async (game) => {
      try {
        const collectionReference = await addDoc(collection(db,'games'),{
                blocks:game.blocks,
                players:game.players,
                turn:game.turn,
                usedWords:game.usedWords,
                redScore:game.redScore,
                blueScore:game.blueScore,
                lastMove:serverTimestamp()
        })
        return collectionReference.id;
      }
      catch {
        console.log("firebase unsuccessful");
      }
  }
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
    // const q = query(collection(db,'players'));
    // const querySnapshot = await getDocs(q);
    let opponent = event.target.elements.opponent.value.trim().toLowerCase();
    if (opponent.includes('@')) {
       opponent = opponent.slice(0,opponent.indexOf('@')); 
    }
    if (players.filter(player => player.name === opponent).length === 0) {
        const names = players.map(player => player.name);
        alert('There is no account under the username ' + opponent + '. Perhaps you meant: ' + findClosest(names,opponent))
        return;
    }
    const newGame = {
        id:'',
        blocks: buildNewGrid(),
        players: [user,opponent],
        turn: user,
        usedWords: [],
        blueScore: 0,
        redScore: 0,
        lastMove:serverTimestamp()
    }
    newGame.id = await createGame(newGame);
    setGame(newGame);
    setGameId(newGame.id);
    setScreen('game');

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
            }}text="Log out" style={{float:'right'}}></Button>
            <div>{user}</div>
            <h1 style={{textAlign:'center'}}>Games</h1>
            <ul style={{padding:5}}>
                {games
                    .filter(game => game.players.includes(user))
                    .sort((game1,game2) =>   {
                        if (game1.lastMove !== null && game2.lastMove !== null) {
                            return game2.lastMove.toDate().getTime() - game1.lastMove.toDate().getTime()
                        }
                        else {
                            return 0;
                        }
                    })
                    .map((game,index) => <Game key={index} onClick={() => handleClick(game)} game={game} user={user} time={formatDate(game)}></Game>)
                    // .map((game,index) => <li className="game" key={index} onClick={() => handleClick(game)}>{game.players[0]} vs {game.players[1]}  <b>{game.turn}'s turn</b> {game.lastMove !== '' && <b>{formatDate(game)}</b>}</li>)}
                }
            </ul>
            <form onSubmit={handleSubmit}>
                <h1>Or enter username of a friend to create game</h1>
                <input name="opponent" type="text" placeholder="opponent"/>
                <input type="submit"/>
            </form>
            <h3 style={{marginBottom:0}}>Players:</h3>
            <ul style={{marginTop:0,paddingBottom:20}}>
                {players.map(player => <li key={player.id}>{player.name}</li>)}
            </ul>


        </div>
    )
}