'use strict'

const database = {
	development: `mongodb+srv://TM:T@cluster0.twawmo4.mongodb.net/?retryWrites=true&w=majority`,
	test: `mongodb+srv://TM:T@cluster0.twawmo4.mongodb.net/?retryWrites=true&w=majority`,
}

const localDb = process.env.TESTENV ? database.test : database.development

const currentDb = process.env.DB_URI || localDb

module.exports = currentDb