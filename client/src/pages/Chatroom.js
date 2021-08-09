import {useState, useEffect} from 'react'
import io from 'socket.io-client'
import {getName} from '../utils/utils'
const socket = io('http://localhost:3020')
let userName;


const Chatroom = ({userName}) => {

    const [chat, setChat] = useState([])
    const [newMessage, setNewMessage] = useState({message: '', name: ''})

    useEffect(() => {
        socket.emit('new-user', userName)
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
        socket.emit('send-message', messageData)
        setNewMessage({message: '', name: ''})
    }

    const handleInput = (e) => {
        setNewMessage({...newMessage, message: e.target.value})
    }

    return (
    <div className='chatroom'>
        <h1>Chatroom</h1>
        <div className='chat-container'>
            <div className="chat-message-list">
            {chat && chat.map(({message, name}, index) => (
            <div className="message-container">
                {name 
                    ? 
                    (name == userName 
                        ?
                        <div className='sent-message'>
                            <p key={index}>{name}: {message}</p>
                        </div>
                        :
                        <div className='received-message'>
                            <p key={index}>{name}: {message}</p>
                        </div>
                    )
                    : <p key={index} className="join-leave">{message}</p>}
            </div>
            ))}
            </div>
            <div className='message-input'>
                <form onSubmit={handleSubmit}>
                    <input type='text' value={newMessage.message} onChange={handleInput} placeholder="type a message"></input>
                    <button type='submit'>Submit</button>
                </form>
        </div>
        </div>
    </div>
     );
}
 
export default Chatroom;
 