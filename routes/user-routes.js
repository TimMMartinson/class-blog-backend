const express = require('express')
const bcrypt = require('bcrypt')

const User = require('../models/user')
const { createUserToken, requireToken } = require('../config/auth')

const router = express.Router()

// POST /sign-up
router.post('/sign-up', (req, res, next) => {
    console.log('req.body:', req.body)
    bcrypt
        .hash(req.body.credentials.password, 10)
        .then(hashedPassword => {
            return {
                email: req.body.credentials.email,
                username: req.body.credentials.username,
                password: hashedPassword
            }
        })
        .then(user => User.create(user))
        .then(user => {
            res.status(201).json({ user: user })
        })
        .catch(next)
})


// POST /sign-in
router.post('/sign-in', (req, res, next) => {
    User.findOne({ email: req.body.credentials.email })
    .then((user) => {
        if (!user) {
            const error = new Error('The provided email or password is incorrect')
            error.statusCode = 401
            throw error
        }

        if (!user.validatePassword(req.body.credentials.password)) {
            const error = new Error('The provided email or password is incorrect')
            error.statusCode = 401
            throw error
        }

        const token = createUserToken(req, user)
        res.status(200).json({ token, user })
    })
    .catch((err) => {
        next(err)
    })
})

// GET current user
router.get('/user', requireToken, (req, res, next) => {
    User.findById(req.user.id)
        .then(user => {
            res.json(user)
        })
        .catch(next)
})

module.exports = router