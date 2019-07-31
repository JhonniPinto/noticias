const userToView = (req, res, next) => {
    if(req.isAuthenticated()) {
        res.locals.user = req.user
        if (!req.session.role) {
            req.session.role = req.user.roles[0]
        }
        res.locals.role = req.session.role
    }
    next()
}

const loginForm = (req, res) => {
    res.render('login')
}

const loginProcess = (passport) => passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: false
})

const facebookProcess = (passport) => passport.authenticate('facebook', { failureRedirect: '/' })
const complement = (req, res) => res.redirect('/')

const googleAuth = (passport) => passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile'] })
const googleCallBack = (passport) => passport.authenticate('google', { failureRedirect: '/', successRedirect: '/'})

const logoutProcess = (req, res) => {
    req.session.destroy()
    res.redirect('/')
}

const changeRole = (req, res) => {
    if( req.isAuthenticated()) {
        if(req.user.roles.indexOf(req.params.role) >= 0) {
            req.session.role = req.params.role
        }
    }
    res.redirect('/')
}

module.exports = {
    userToView,
    loginForm,
    loginProcess,
    facebookProcess,
    complement,
    googleAuth,
    googleCallBack,
    logoutProcess,
    changeRole
}