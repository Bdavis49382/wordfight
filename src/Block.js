import React,{useEffect, useState} from 'react';

function Block({blocks, index, setBlocks, turn, setWord}) {
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
    const checkNeighbors = () => {
        const x = (block) => block.index%5;
        const y = (block) => Math.floor(block.index/5);
        const neighbors = blocks.filter((potentialNeighbor) => {
            const differenceY = Math.abs(y(potentialNeighbor)-y(block));
            const differenceX = Math.abs(x(potentialNeighbor)-x(block));
            return   ((x(potentialNeighbor) == x(block))&&(differenceY == 1)) || ((y(potentialNeighbor)==y(block))&&(differenceX == 1));
        }
        )
        const neighborsAreBlue = neighbors.every((neighbor) => neighbor.allegiance==='blue' || neighbor.allegiance === 'solidBlue');
        if(neighborsAreBlue && block.allegiance== 'blue'){

            changeAllegiance('solidBlue');
        }


    }
    useEffect(() => {
        if(clicked) {
            changeAllegiance('blue');
        }
        setClicked(false);
        

    },[turn])
    useEffect(() => {
        checkNeighbors();
    },[blocks])
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