const restrito = (req, res, next) => {
    if (req.isAuthenticated()) {
        if(req.user.roles.indexOf('restrito') >= 0) {
            return next()
        } else {
            res.redirect('/')
        }
    }
    res.redirect('/login')
}

const index = (req, res) => res.send('restrito')

const noticia = async(noticiaModel, req, res) => {
    const noticias = await noticiaModel.find({ category: 'private' })
    res.render('noticias/restrito', { noticias })
}

module.exports = {
    restrito,
    index,
    noticia
}