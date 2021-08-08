require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const User = require('./models/user')
const jwt = require('jsonwebtoken')
const httpServer = require('http').createServer(app)
const io = require('socket.io')(httpServer, {
  cors: {
    origin: "http://localhost:3000",  
    method: ["GET", "POST"]
  }
})


app.use(express.urlencoded({extended: true}));
app.use(express.json())


const url = process.env.MONGODB_URI
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true})
  .then(res => console.log('connected to MongoDB'))
  .catch(err => console.log(err.message))



const maxAge = 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({id}, 'key', {expiresIn: maxAge})
}


app.post('/api/signup', async (req, res) => {
  const {email, pw, name} = req.body;

  try {
    const user = await User.create({email, password: pw, first_name: name.first, last_name: name.last})
    const token = createToken(user._id)
    res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000})
    res.status(201).json({user: user._id})
  } catch (err) {
    console.log(err)
  }
})

app.post('/api/login', async (req, res) => {
  const {email, pw} = req.body
  
  try {
  const user = await User.login(email, pw)
  const token = createToken(user._id)
  res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000})
  res.status(200).json({user: user._id})
  } catch (err) {
    console.log(err)
  }
})




const users = {}

io.on('connection', socket => {
  console.log(socket.id)

  socket.on('new-user', userName => {
    users[socket.id] = userName
    socket.broadcast.emit('user-connected', userName)
    console.log(`${userName} has joined.`)
  })

  socket.on('send-message', messageObj => {
    console.log(messageObj)
    socket.broadcast.emit('recieved-message', messageObj)
  })

  socket.on('disconnect', () => {
    console.log(`${users[socket.id]} has left.`)
    socket.broadcast.emit('user-disconnected', users[socket.id])
    delete users[socket.id]
  })
})

const port = process.env.PORT
httpServer.listen(port, function() {
  console.log(`listening on port ${port}`)
})


// const app = require('express')()
// const httpServer = require('http').createServer(app)
// const io = require('socket.io')(httpServer); 
// // const users = {}

// io.on('connection', (socket) => {
//     console.log(socket.id)
//     socket.on('new-user', (userName) => {
//         console.log(`${userName} has joined.`)
//     })
// }); 

// httpServer.listen(3020, () => console.log('listening on port 3020'))



// app.post('/api/room', (req, res) => {
//     if (rooms[req.body.room] != null) {
//         return res.redirect('/')
//     }
//     rooms[req.body.room] = {users: {} }
//     res.redirect(req.body.room)
//     io.emit('new-room', req.body.room)
// })


// app.get('/api/:room', (req, res) => {
//     if (rooms[req.params.room] == null) {
//         return res.redirect('/')
//     }
//     res.render('room', {roomName: req.params.room})
// })

    // socket.on('new-user', (userName) => {
    //     users[socket.id] = userName
    //     console.log(socket.id, userName)
    //     socket.broadcast.emit('user-connected', userName)
    // })
    // socket.on('send-message', (message) => {
    //     socket.broadcast.emit('display-message', {message})
    // })
    // socket.on('disconnect', () => {
    //     socket.broadcast.emit('user-disconnected', users[socket.id])
    //     delete users[socket.id]
    //     })
    // })



