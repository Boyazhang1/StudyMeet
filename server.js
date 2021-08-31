require("dotenv").config();
const { compareSync } = require("bcrypt");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Room = require("./models/room");
const router = require("./routes/authenticationRoutes");
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:3000" || "https://studymeet1.herokuapp.com",
    method: ["GET", "POST"],
  },
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'))
  app.get('/', (req, res) => {
      res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'))
  })
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(router);

const url = process.env.MONGODB_URI;
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then((res) => console.log("connected to MongoDB"))
  .catch((err) => console.log(err.message));


app.post("/api/rooms", async (req, res) => {
  const roomName = req.body.roomName;
  if (await Room.findOne({ room_name: roomName })) {
    return res.status(404).json({ error: "that room already exists" });
  }
  const newRoom = await Room.create({ room_name: roomName, users: [] });
  io.emit("new-room", roomName);
  res.status(200).json(newRoom);
});


app.get('/api/rooms', (req, res) => {
  Room.find({}, (err, foundRooms) => {
    let roomNames = []
    foundRooms.forEach(room => roomNames.push(room.room_name))
    res.json(roomNames)
  })
})


io.on("connection", (socket) => {
  console.log('new connection', socket.id)
  socket.on("new-user", (userName, roomName, userID) => {
    try {
      Room.findOne({ room_name: roomName }, async (err, foundRoom) => {
        if (foundRoom) {
          socket.join(roomName);
          let userIndex = foundRoom.users.findIndex(user => user.user_id == userID)
          if (userIndex !== -1) {
            foundRoom.users[userIndex].socket_id = socket.id
          } else {
            foundRoom.users.push({ socket_id: socket.id, user_name: userName, user_id: userID});
          }
          await foundRoom.save();
          socket.to(roomName).emit("user-connected", userName);
          console.log(`${userName} has joined ${roomName}`);
        }
      });
    } catch (err) {
      console.log("that room does not exist.");
    }
  });

  socket.on("send-message", (messageObj, roomName) => {
    socket.to(roomName).emit("recieved-message", messageObj);
  });

  socket.on("send-drawing", (drawingData, roomName) => {
    socket.to(roomName).emit("received-drawing", drawingData);
  });

  socket.on("disconnect", () => {
    Room.findOne({ "users.socket_id" : socket.id }, async (err, foundRoom) => {
      if (foundRoom) {
        const userName = foundRoom.users.find(user => user.socket_id === socket.id.toString()).user_name
        const roomName = foundRoom.room_name
        foundRoom.users.pull({ socket_id: socket.id.toString() });
        await foundRoom.save();
        socket.to(foundRoom.room_name).emit("user-disconnected", userName);
        console.log(`${userName} has left ${roomName}`);
      }
    });
  });
});

// connect to port
const port = process.env.PORT || 3020;
httpServer.listen(port, () => {
  console.log(`listening on port ${port}`);
});



// testing routes


// {"roomName": "newroom", "userName": "Shane", "userID": "vc", "socket": {"id": 221}}



// app.post("/api/rooms/join", (req, res) => {
//   const roomName = req.body.roomName;
//   const userName = req.body.userName;
//   const userID = req.body.userID; 
//   const socket = req.body.socket; 
//   Room.findOne({ room_name: roomName }, async (err, foundRoom) => {
//     if (foundRoom) {
//       let userIndex = foundRoom.users.findIndex(user => user.user_id == userID)
//       if (userIndex !== -1) {
//         foundRoom.users[userIndex].socket_id = socket.id
//       } else {
//         foundRoom.users.push({ socket_id: socket.id, user_name: userName, user_id: userID});
//       }
//       await foundRoom.save();
//       res.status(200).json(foundRoom);
//       // socket.to(roomName).emit("user-connected", userName);
//       console.log(`${userName} has joined ${roomName}`);
//     }
//   })
// });

// app.post("/api/rooms/leave", (req, res) => {
//   const socket = req.body.socket;
//   Room.findOne({ "users.socket_id" : socket.id }, async (err, foundRoom) => {
//     if (foundRoom) {
//       foundRoom.users.pull({ socket_id: socket.id.toString() });
//       await foundRoom.save();
//       res.status(200).json(foundRoom);
//     }
//   });
// });

// app.post("/api/rooms/check", (req, res) => {
//   const roomName = req.body.roomName;
//   Room.findOne({ room_name: roomName }, (err, found) => {
//     res.status(200).json(found);
//   });
// });