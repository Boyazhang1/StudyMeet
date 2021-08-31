const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
    room_name: {
        type: String, 
        required: true
    }, 
    users: [{socket_id: String, user_name: String, user_id: String, _id: false}]
})

const Room = mongoose.model('room', roomSchema)
module.exports = Room; 