export default function SelectionScreen({games, user,setGame}) {
    return (
        <div>
            <h1>Select a game</h1>
            <ul>
                {games.filter(game => game.user === user).map(game => <li>{game.players[0]}vs{game.players[1]}.</li>)}
            </ul>

        </div>
    )
}