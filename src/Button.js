export default function Button({onClick,text,style}) {
    const defaultStyle = {
        border:'1.5px solid black',
        borderRadius: '5px',
        backgroundColor:'gray',
        color:'black'
    }

    return (
        <div className='customButton' onClick={onClick} style={{...defaultStyle,...style}}>
            {text}
        </div>
    )
}