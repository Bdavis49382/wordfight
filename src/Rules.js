import Button from './Button';
export default function Rules({setScreen,style}) {
    return (
        <div style={style}>
           <Button text="Home" onClick={() => setScreen('home')} style={{float:'right'}}></Button> 
           <h2 style={{textAlign:'center'}}>Rules</h2>
           <p>Wordfight is a simple word-based strategy game. Each player fights to control the board by creating words on their turn.
             The first player to 'own' 10 blocks wins.</p>
           <p>The game board is made up of 25 letter blocks, randomly generated each game. On their turn, the player uses the letters on the blocks
             to form any word they wish. Once they have submitted their word those blocks will turn the color of that player.
             When a block is completely surrounded by its color, that player now 'owns' that block. It can still be used by their opponent,
             but the ownership of the block will not be changed unless the ownership of the surrounding blocks is changed first.</p>
             <p>As stated before, to win you must have 10 of these enclosed blocks at one time. At that point the game immediately ends.</p>
             <p></p>
             <p>In addition: a block cannot be used twice in one word and no word can be repeated in the same game.</p>
             <p>To get Started: After creating an account and having a friend create an account, enter their username in the selection screen to create a game with them!</p>

        </div>
    )
}