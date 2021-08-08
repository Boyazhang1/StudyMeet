const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const {isEmail} = require('validator')

const userSchema = new mongoose.Schema ({
    first_name: {
        type: String, 
        required: [true, 'enter a first name']
    }, 
    last_name: {
        type: String, 
        required: [true, 'enter a last name']
    }, 
    email: {
        type: String, 
        required: [true, 'enter a email'],
        unique: true, 
        lowercase: true, 
        validate: [isEmail, 'enter a valid email']
    }, 
    password: {
        type: String, 
        required: [true, 'enter a password'], 
        minlength: [6, 'min length is 6 chars']
    }
})

userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt(); 
    this.password = await bcrypt.hash(this.password, salt)
    next(); 
})

userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({email})

    if (user) {
        const authUser = await bcrypt.compare(password, user.password)
        if (authUser) {
            return user
        }
        throw Error("Incorrect password")
    }
    throw Error("User doesn't exist")
}

const User = mongoose.model('user', userSchema)
module.exports = User; 