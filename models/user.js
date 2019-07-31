const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const genPassHash = async (password) => {
    const salt = await bcrypt.genSalt()
    const hash = await bcrypt.hash(password, salt)
    return hash
}

const UserSchema = new mongoose.Schema({
    username: {
        type: String
    },
    password: {
        type: String
    },
    name: String,   
    facebookId: String,
    googleId: String,
    roles: {
        type: [String],
        enum: ['restrito', 'admin']
    }
})

UserSchema.pre('save', async function (next) {
    const user = this

    if (!user.isModified('password')) {
        return next()
    }

    user.password = await genPassHash(user.password)
    next()
})

UserSchema.methods.checkPassword = function (password) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, this.password, (err, isMatch) => {
            if (err) {
                reject(err)
            } else {
                resolve(isMatch)
            }
        })
    })
}

const User = mongoose.model('User', UserSchema)

module.exports = User