function Block({blocks, index, setBlocks, turn, setWord,user}) {
    const block = blocks[index];
    const {clicked=false,allegiance, surrounded} = block;

    const colors = {'solidBlue':'#0e75e3','blue':'#5ba3f0','none':'white','red':'#db4d4d','solidRed':'#d10d0d'}
    const color = allegiance ===  user ? (surrounded ? colors.solidRed : colors.red) : (allegiance === 'none' ? colors.none :(surrounded ? colors.solidBlue : colors.blue))
    const styles = {
        background:color,
        color:'black',
        opacity: clicked ?0.05 : 1,
        fontWeight: clicked?'':'bold',
        cursor: !clicked&&turn===user?'pointer':'default'
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