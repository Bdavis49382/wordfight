import BlockGrid from './BlockGrid';
import Button from './Button';
import { buildNewGrid } from './utils';
export default function Home({setScreen,style}) {
    const getFakeBlocks = () => {
        let blocks = buildNewGrid().map(it => {
            it.clicked=true;
            return it;

        })
        "word".toUpperCase().split("").forEach((letter, index) => {
            blocks[5+index].allegiance = "title"
            blocks[5+index].letter = letter
            blocks[5+index].clicked = false
        })
        "fight".toUpperCase().split("").forEach((letter, index) => {
            blocks[10+index].allegiance = "other"
            blocks[10+index].letter = letter
            blocks[10+index].clicked = false
        })
        return blocks
    }
    return (
        <div style={{...style,textAlign:'center'}}>
            <div style={{height:80}}></div>
            <BlockGrid turn="" setWord={() => {}} setBlocks={() => {}} usedWords={[]} players={[]} blocks={getFakeBlocks()} user="title"/>
            <div style={{'display':'flex','flexDirection':'row', 'justifyContent':'center'}}>
                <Button onClick={() => setScreen('login')} text='Log in' style={{'margin':10}} />
                <Button onClick={() => setScreen('register')} text='Register'style={{'margin':10}} />
                <Button onClick={() => setScreen('rules')} text='Rules'style={{'margin':10}} />
            </div>
        </div>
    )
}