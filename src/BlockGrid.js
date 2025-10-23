import './App.css';
import Block from './Block.js';

function BlockGrid({turn, setWord,blocks,setBlocks,usedWords,players, user}) {

    const makeTable = () => {
        const blockRows = [];
        for(let i=0;i<5;i++){
            blockRows.push(blocks.filter(block => Math.floor(block.index/5)===i));
        }
        return blockRows.map((row,index) => 
            <tr key={index}>
                {row.map((block,index) =>
                    <Block usedWords={usedWords} key={index} blocks={blocks} index={block.index} players={players} setBlocks={setBlocks} turn={turn} setWord={setWord} user={user}/>)
                }
            </tr>);
    }
    return (
        <table className="blockGrid">
            <tbody>
            {makeTable()}
            </tbody>
        </table>
    );
}
export default BlockGrid;