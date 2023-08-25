const colors = {'solidBlue':'#0e75e3','blue':'#5ba3f0','none':'white','red':'#db4d4d','solidRed':'#d10d0d'}
export default function Game({game,user,onClick,time}) {
    const opponent = game.players[0] !==user?game.players[0]:game.players[1];
    const backgroundColor = (game.redScore >= 10 || game.blueScore >= 10)?'gray':user===game.players[1]?colors.blue:colors.red
    return (
        <div onClick={onClick} style={{border:'1px black solid',borderRadius:3,marginBottom:5,backgroundColor:backgroundColor,cursor:'pointer',color:'black'}}>
            <div><b>{opponent}</b></div>
            <div>{game.turn}'s Turn</div>
            <div>{time}</div>
        </div>
    )
}