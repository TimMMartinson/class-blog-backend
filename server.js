// Importing requirements
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const db = require('./config/db')
//Routes here
const userRoutes = require('./routes/user-routes')
const postRoutes = require('./routes/post-routes')
const commentRoutes = require('./routes/comment-routes')
// import request logger
const requestLogger = require('./lib/request-logger.js')

// PORT is magic number
const PORT = 8000

mongoose.set('strictQuery', true)

mongoose.connect(db, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})

const app = express()

// Making app use all routes and utilities


app.use(cors({ origin: `http://localhost:3000` }))

app.use(express.json())
app.use(requestLogger)
app.use(userRoutes)
app.use(postRoutes)
app.use(commentRoutes)
app.listen(PORT, () => {
	console.log('listening on port ' + PORT)
})

module.exports = app