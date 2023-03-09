const express = require('express')

const mongoose = require('mongoose')

const cors = require('cors')

const db = require('./config/db')

//Routes here

const PORT = 8000

mongoose.set('strictQuery', true)

mongoose.connect(db, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})

const app = express()

app.use(cors({ origin: `http://127.0.0.1:5500` }))

app.use(express.json())
app.use(requestLogger)

app.listen(PORT, () => {
	console.log('listening on port ' + PORT)
})

module.exports = app