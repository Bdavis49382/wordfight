export default function Form({text,handleSubmit}) {

    return (
        <form onSubmit={handleSubmit}>
            <h1>{text}</h1>
            <input name="username" type="text" placeholder="email"/>
            <input name="password" type="password" placeholder="password"/>
            <input type="submit"/>
        </form>
    )
}