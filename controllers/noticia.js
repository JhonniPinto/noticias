const index = async(noticiaModel, req, res) => {
    const noticias = await noticiaModel.find({ category: 'public' })
    res.render('noticias/index', { noticias })
}

module.exports = {
    index
}