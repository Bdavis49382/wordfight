import React,{useEffect, useState} from 'react';

function Block({blocks, index, setBlocks, turn, setWord,players,usedWords}) {
    const block = blocks[index];
    const {clicked,allegiance} = block;

    const colors = {'solidBlue':'#0e75e3','blue':'#5ba3f0','none':'white','red':'#db4d4d','solidRed':'#d10d0d'}
    const styles = {
        background:colors[allegiance],
        color:'black',
        opacity: clicked ?0.2 : 1
    }
    const changeAllegiance = (color) => {
        setBlocks((prevBlocks) => {
            return prevBlocks.map((b) => {
                if(b.index===block.index){
                    return {...b,
                        allegiance:color};
                }
                else {
                    return b;
                }
            })});
    } 
    const setClicked = (value) => {
        setBlocks((prevBlocks) => {
            return prevBlocks.map((b) => {
                if(b.index===block.index){
                    return {...b,clicked:value};
                }
                else{
                    return b;
                }
            })
        })
    }
    const neighborsAre = (neighbors) => {
        if (neighbors.every((neighbor) => neighbor.allegiance==='blue'|| neighbor.allegiance ==='solidBlue')) {
            return 'blue';
        }
        else if (neighbors.every((neighbor) => neighbor.allegiance==='red'|| neighbor.allegiance ==='solidRed')) {
            return 'red';
        }
        else {
            return '';
        }
    }
    const checkNeighbors = () => {
        const x = (otherBlock) => otherBlock.index%5;
        const y = (otherBlock) => Math.floor(otherBlock.index/5);
        const neighbors = blocks.filter((potentialNeighbor) => {
            const differenceY = Math.abs(y(potentialNeighbor)-y(block));
            const differenceX = Math.abs(x(potentialNeighbor)-x(block));
            return   ((x(potentialNeighbor) == x(block))&&(differenceY == 1)) || ((y(potentialNeighbor)==y(block))&&(differenceX == 1));
        }
        )
        const playerColor = turn===players[1]?'blue':'red';
        const solidColor = turn===players[1]?'solidBlue':'solidRed';
        const opponentColor = playerColor === 'red'?'blue':'red';
        const opponentSolidColor = playerColor === 'red'?'solidBlue':'solidRed';
        const neighborsColor = neighborsAre(neighbors);
        
        if(neighborsColor === playerColor && block.allegiance===playerColor){

            changeAllegiance(solidColor);
        }
        else if (neighborsAre(neighbors) === '' && block.allegiance===opponentSolidColor) {
            changeAllegiance(opponentColor);
        }


    }
    useEffect(() => {
        const playerColor = turn===players[1]?'blue':'red';
        const solidEnemyColor = turn===players[1]?'solidRed':'solidBlue';
        if(clicked && allegiance !== solidEnemyColor) {
            changeAllegiance(playerColor);
        }
        setClicked(false);

    },[usedWords])
    useEffect(() => {
        checkNeighbors();
    },[blocks,turn])
    const handleClick = () => {
        if(turn) {
            if(clicked){
                setClicked(false);
                setWord((word) => word.filter((wordBlock) => wordBlock.index!=block.index));
            }
            else {
                setWord((word) => [...word,block])
                setClicked(true);
            }

        }
        
    }
    return (
        <td 
            key={index}
            style={styles}
            onClick={handleClick}>
            {block.letter}
            
        </td>
    )
}
export default Block;