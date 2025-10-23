const colors = {'solidBlue':'#0e75e3','blue':'#5ba3f0','none':'white','red':'#db4d4d','solidRed':'#d10d0d'}
export default function Game({game,user,onClick,time}) {
    const opponent = game.players[0] !==user?game.players[0]:game.players[1];
    const backgroundColor = user===game.players[1]?colors.blue:colors.red
    const gameStyle = {
        border:'1px black solid',
        borderRadius:3,
        marginBottom:5,
        backgroundColor:backgroundColor,
        cursor:'pointer',
        opacity:game.turn===user?'100%':'60%',
        color:'black'}
    const userIndex = game.players[0] === user ? 0 : 1;
    const won = game.scores[userIndex] >= 10 

    if (game.finished) {
        return (
            <div onClick={onClick} style={{...gameStyle,backgroundColor:'gray',opacity:'70%'}}>
                <div><b>{opponent}</b></div>
                <div>{won ? 'You' : 'They'} Won</div>
                <div>Finished {time}</div>
            </div>
        )
    }
    else {
        return (
            <div onClick={onClick} style={gameStyle}>
                <div><b>{opponent}</b></div>
                <div>{game.turn}'s Turn</div>
                <div>Last Move: {time}</div>
            </div>
        )
    }
}