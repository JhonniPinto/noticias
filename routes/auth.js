const router          = require('express').Router()
const passport        = require('passport')
const LocalStrategy   = require('passport-local').Strategy
const FaceBStrategy   = require('passport-facebook').Strategy
const GoogleStrategy  = require('passport-google-oauth').OAuth2Strategy

const loginController = require('../controllers/login')
const User            = require('../models/user')

router.use(passport.initialize())
router.use(passport.session())

// estratégia local
passport.use(new LocalStrategy(async(username, password, done) => {
    const user = await User.findOne({ username })
    if (user) {
        const isValid = await user.checkPassword(password)
        if (isValid) {
            return done(null, user)
        } else {
            return done(null, false)
        }
    } else {
        return done(null, false)
    }
}))
// estratégia facebook
passport.use(new FaceBStrategy({
    clientID: '454024378482160',
    clientSecret: '081623ba9caf498946ea4079f2dd62bb',
    callbackURL: 'http://localhost:3000/facebook/callback',
    profileFields: ['id', 'displayName', 'email', 'photos']
}, async(accessToken, refreshToken, profile, done) => {
    const userDB = await User.findOne({ facebookId: profile.id })
    if (!userDB) {
        const user = new User({
            name: profile.displayName,
            facebookId: profile.id,
            roles: ['restrito']
        })
        await user.save()
        done(null, user)
    } else {
        done(null, userDB)
    }
}))
// estratégia google
passport.use(new GoogleStrategy({
    clientID: '262551392823-q24ubhlqqrvuk1ck5lingkmjc04mvh8c.apps.googleusercontent.com',
    clientSecret: 'FiA_T0Gk4vju8AXuD0wSy7Xa',
    callbackURL: 'http://localhost:3000/google/callback'
}, async(accessToken, refreshToken, err, profile, done) => {
    const userDB = await User.findOne({ googleId: profile.id})
    if (!userDB) {
        const user = new User({
            name: profile.displayName,
            googleId: profile.id,
            roles: ['restrito']
        })
        await user.save()
        done(null, user)
    } else {
        done(null, userDB)
    }
}))

passport.serializeUser((user, done) => {
    done(null, user)
})
passport.deserializeUser((user, done) => {
    done(null, user)
})

router.use(loginController.userToView)

router.get('/login', loginController.loginForm)
router.post('/login', loginController.loginProcess(passport))
router.get('/facebook', passport.authenticate('facebook'))
router.get('/facebook/callback', loginController.facebookProcess(passport), loginController.complement)
router.get('/google', loginController.googleAuth(passport))
router.get('/google/callback', loginController.googleCallBack(passport()))
router.get('/logout', loginController.logoutProcess)
router.get('/change-role/:role', loginController.changeRole)

module.exports = router