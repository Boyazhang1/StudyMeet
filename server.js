require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const router = require('./routes/authenticationRoutes')
const httpServer = require('http').createServer(app)
const io = require('socket.io')(httpServer, {
  cors: {
    origin: "http://localhost:3000",  
    method: ["GET", "POST"]
  }
})


app.use(express.urlencoded({extended: true}));
app.use(express.json())
app.use(router)


const url = process.env.MONGODB_URI
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true})
  .then(res => console.log('connected to MongoDB'))
  .catch(err => console.log(err.message))


const rooms = {}
app.post('/api/rooms', (req, res) => {
  const roomName = req.body.roomName
  console.log(rooms[roomName])
  if (rooms[roomName]) {
    return res.status(404).json({error: 'that room already exists'})
  }
  rooms[roomName] = {users: {}}
  io.emit("new-room", req.body.roomName)
  res.status(200).json({rooms})
})


io.on('connection', socket => {
  console.log(socket.id)

  socket.on('new-user', (userName, roomName) => {
    socket.join(roomName)
    rooms[roomName].users[socket.id] = userName
    socket.to(roomName).emit('user-connected', userName)
    console.log(`${userName} has joined ${roomName}`)
  })

  socket.on('send-message', (messageObj, roomName) => {
    socket.to(roomName).emit('recieved-message', messageObj)
  })
  socket.on('send-drawing', (drawingData, roomName) => {
    socket.to(roomName).emit('received-drawing', drawingData)
  })

  socket.on('disconnect', () => {
    getUserRooms(socket).forEach(roomName => {
      socket.to(roomName).emit('user-disconnected', rooms[roomName].users[socket.id])
      console.log(`${rooms[roomName].users[socket.id]} has left ${roomName}`)
      delete rooms[roomName].users[socket.id]
    })
  })

})

const port = process.env.PORT
httpServer.listen(port, function() {
  console.log(`listening on port ${port}`)
})

const getUserRooms = socket => {
  return Object.keys(rooms).filter(roomName => {
    let roomUsers = rooms[roomName].users 
      if (socket.id in roomUsers) {
        return true
      } 
      return false
  })
}




