import {useState, useEffect} from 'react'
import Cookies from 'js-cookie'
import jwt_decode from "jwt-decode"
import Whiteboard from '../components/Whiteboard'

const Chatroom = ({socket, roomName}) => {

    const userName = jwt_decode(Cookies.get('jwt')).name

    const [chat, setChat] = useState([])
    const [newMessage, setNewMessage] = useState({message: '', name: ''})

    useEffect(() => {
        socket.emit('new-user', userName, roomName)
        console.log('new user emitted')
        setChat(chat.concat({...newMessage, message: "You joined the chat"}))
      }, [])

    socket.on('user-connected', (user) => {
        setChat(chat.concat({...newMessage, message: `${user} has joined the chat`}))
    })

    socket.on('user-disconnected', (user) => {
        setChat(chat.concat({...newMessage, message: `${user} has left the chat`}))
    })

    socket.on('recieved-message', (messageObj) => {
        console.log('recieved', messageObj)
        setChat(chat.concat(messageObj))
    })

    const handleSubmit = (e) => {
        e.preventDefault(); 
        const messageData = {message: newMessage.message, name: userName}
        setChat(chat.concat(messageData))
        console.log(messageData)
        socket.emit('send-message', messageData, roomName)
        setNewMessage({message: '', name: ''})
    }

    const handleInput = ({target}) => {
        setNewMessage({...newMessage, message: target.value})
    }

    const getTime = () => {
        const date = new Date()
        return date.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'})
    }
    return (
    <div className='chatroom'>
        <h1>Chatroom</h1>
        <div className="study-dashboard">
        <div className='chat-container'>
            <div className="chat-message-list">
            {chat && chat.slice().reverse().map(({message, name}, index) => (
            <div className="message-container">
                {name 
                    ? 
                    (name == userName
                        ?
                        <div className='sent-message'>
                            <p key={index}>{name}: {message}</p>
                            <span>{getTime()}</span>
                        </div>
                        :
                        <div className='received-message'>
                            <p key={index}>{name}: {message}</p>
                            <span>{getTime()}</span>
                        </div>
                    )
                    : <p key={index} className="join-leave">{message}</p>}
            </div>
            ))}
            </div>
            <div className='message-input'>
                <form onSubmit={handleSubmit}>
                    <input type='text' value={newMessage.message} onChange={handleInput} placeholder="type a message" required></input>
                    <button type='submit'>Submit</button>
                </form>
        </div>
        </div>
        <Whiteboard/>
        </div>
    </div>
     );
}
 
export default Chatroom;
 