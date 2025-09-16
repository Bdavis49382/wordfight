import React,{useEffect, useState} from 'react';

function Block({blocks, index, setBlocks, turn, setWord,players,usedWords}) {
    const block = blocks[index];
    const {clicked,allegiance} = block;

    const colors = {'solidBlue':'#0e75e3','blue':'#5ba3f0','none':'white','red':'#db4d4d','solidRed':'#d10d0d'}
    const styles = {
        background:colors[allegiance],
        color:'black',
        opacity: clicked ?0.05 : 1,
        fontWeight: clicked?'':'bold',
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