import Button from './Button';
export default function Home({setScreen,style}) {
    const boxStyle = {
        border:'solid black 1px',
        borderRadius: '3px',
        width:'50px',
        display:'inline-block',
        marginLeft:8,
        marginTop:0,
        fontSize:'150%',
        backgroundColor:'#FFFFFF'
    }
    return (
        <div style={{...style,textAlign:'center'}}>
            <h1 id='homeHeader' style={{fontSize:'250%',marginBottom:0}}>Word</h1>
            <span style={boxStyle}>F</span>
            <span style={boxStyle}>I</span>
            <span style={{...boxStyle,backgroundColor:'red'}}>G</span>
            <span style={{...boxStyle,backgroundColor:'blue'}}>H</span>
            <span style={boxStyle}>T</span>
            <Button onClick={() => setScreen('login')} text='Log in' style={{margin:'auto',marginTop: '100px'}}/>
            <Button onClick={() => setScreen('register')} text='Register' style={{margin:'auto',marginTop: '20px'}}/>
        

        </div>
    )
}