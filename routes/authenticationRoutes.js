const router = require('express').Router(); 
const User = require('../models/user')
const jwt = require('jsonwebtoken')



const maxAge = 24 * 60 * 60;
const createToken = (id, name) => {
  return jwt.sign({id, name}, process.env.SECRET, {expiresIn: maxAge})
}


const handleError = (err) => {
  let errorMessage = {email: '', password: '', login: ''}
  
  if (err.code === 11000) {
    errorMessage.email = "that email is already registerd"
  }
  if (['Incorrect password', "User doesn't exist"].some(msg => err.message === msg)) {
    errorMessage.login = "incorrect username or password"
  }
  if (err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach(({properties}) => {
      errorMessage[properties.path] = properties.message
    })
  }
  return errorMessage
}

router.post('/api/signup', async (req, res) => {
    const {email, pw, name} = req.body;
  
    try {
      const user = await User.create({email, password: pw, first_name: name.first, last_name: name.last})
      res.status(201).json({user: user._id})
    } catch (err) {
      const errorMsg = handleError(err)
      res.status(404).json({errorMsg})
    }
  })
  
router.post('/api/login', async (req, res) => {
    const {email, pw} = req.body
    
    try {
    const user = await User.login(email, pw)
    const token = createToken(user._id, user.first_name)
    res.cookie('jwt', token, {maxAge: maxAge * 1000})
    res.status(200).json({userID: user._id})
    } catch (err) {
      const errorMsg = handleError(err)
      res.status(404).json({errorMsg})
    }
  })
  
router.get('/api/logout', async (req, res) => {
    res.cookie('jwt', '', {maxAge: 1})
    res.sendStatus(200)
  })

module.exports = router; 