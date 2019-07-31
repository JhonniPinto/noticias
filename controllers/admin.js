const restrito = (req, res, next) => {
    if (req.isAuthenticated()) {
        if (req.user.roles.indexOf('admin') >= 0) {
            return next()
        } else {
            res.redirect('/')
        }
    } 
    res.redirect('/login')
}

const index = (req, res) => res.send('admin')

const noticia = async(noticiaModel, req, res) => {
    const noticias = await noticiaModel.find()
    res.render('noticias/admin', { noticias })
}

module.exports = {
    restrito,
    index,
    noticia
}