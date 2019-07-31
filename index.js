const express    = require('express')
const path       = require('path')
const app        = express()
const mongoose   = require('mongoose')
const session    = require('express-session')
const bodyParser = require('body-parser')

const User     = require('./models/user')
const noticias = require('./routes/noticias')
const restrito = require('./routes/restrito')
const login    = require('./routes/auth')
const pages    = require('./routes/pages')
const admin    = require('./routes/admin')

const port     = process.env.PORT || 3000
const mongo    = process.env.MONGODB || 'mongodb://localhost/noticias'

mongoose.Promise = global.Promise

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({
    secret: 'top',
    name: 'sessionId',
    resave: true,
    saveUninitialized: true
}))


const createInitialUser = async() => {
    const total = await User.estimatedDocumentCount()
    if (total === 0) {
        const user = new User({
            username: 'user1',
            password: '1234',
            roles: ['restrito', 'admin']
        })
        await user.save(() => console.log('Initial user created'))
    } else {
        console.log('Initial user created skipped')
    }
}   

app.use('/', login)
app.use('/', pages)
app.use('/noticias', noticias)
app.use('/restrito', restrito)
app.use('/admin', admin)

mongoose.connect(mongo, { useNewUrlParser: true })
    .then(() => {
        createInitialUser()
        app.listen(port, () => console.log('Notícias is running...'))
    })
    .catch(err => console.log('ERROR:', err))

