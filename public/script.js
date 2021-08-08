// insert heroku link
const socket = io('http://localhost:3000');
const roomContainer = document.getElementById('room-container')
const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')

if (messageForm != null) {

    const userName = prompt("What is your name")
    appendMessage('You joined')
    socket.emit('new-user', roomName, userName)

    messageForm.addEventListener('submit', (e) => {
        e.preventDefault()
        const message = messageInput.value 
        appendMessage(`You: ${message}`)
        socket.emit('send-message', roomName, message)
        messageInput.value = ''
    })
}

socket.on('new-room', (roomName) => {
    const roomElement = document.createElement('div')
    roomElement.innerText = roomName
    const roomLink = document.createElement('a')
    roomLink.href = `./${roomName}`
    roomContainer.append(roomElement, roomLink)
})

// displays message for other users
socket.on('display-message', data => {
    appendMessage(`${data.name}: ${data.message}`)
})

socket.on('user-connected', (userName) => {
    appendMessage(`${userName} has joined.`)
})

socket.on('user-disconnected', (userName) => {
    appendMessage(`${userName} has left.`)
})

function appendMessage(message) {
    const newMessage = document.createElement('div')
    newMessage.innerText = message
    messageContainer.append(newMessage)
}
