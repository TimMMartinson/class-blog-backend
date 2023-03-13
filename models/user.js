const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        // Only hashed PW results are stored
        password: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: (_doc, user) => {
                // this is so the user's PW is not included in the JSON data
                delete user.password
                return user
            },
        },
    }
)

userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.password)
}

module.exports = mongoose.model('User', userSchema)