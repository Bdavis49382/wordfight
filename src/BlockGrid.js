import React,{useEffect, useState} from 'react';
import './App.css';
import Block from './Block.js';
// import { collection , onSnapshot , serverTimestamp, addDoc, query, orderBy} from 'firebase/firestore';
// import { db} from './firebase.js';

function BlockGrid({turn, setWord,blocks,setBlocks,usedWords,players}) {

    useEffect(() => {
        if(blocks.length === 0){
            const tempBlocks =buildNewGrid() 
            setBlocks(tempBlocks);
        }

    },[])
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
    const makeTable = () => {
        const blockRows = [];
        // console.log(blocks)
        for(let i=0;i<5;i++){
            blockRows.push(blocks.filter(block => Math.floor(block.index/5)===i));
        }
        return blockRows.map((row,index) => 
            <tr key={index}>
                {row.map((block,index) =>
                    <Block key={index} blocks={blocks} index={block.index} players={players} setBlocks={setBlocks} turn={turn} setWord={setWord} />)
                }
            </tr>);
    }
    return (
        <table>
            <tbody>
            {makeTable()}
            </tbody>
        </table>
    );
}
export default BlockGrid;