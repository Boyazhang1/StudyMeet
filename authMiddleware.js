const jwt = require('jsonwebtoken')
const User = require('./models/user')

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt

    if (token) {
        jwt.verify(token, 'key', (err, decoded) => {
            if (err) {
                return res.status(300).end()
            } else {
                next()
            }
        })
    } else {
        return res.status(300).end()
    }
}

