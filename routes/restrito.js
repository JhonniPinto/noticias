const router          = require('express').Router()
const noticiaModel    = require('../models/noticias')
const restritoControl = require('../controllers/restrito')

router.use(restritoControl.restrito)
router.get('/', restritoControl.index)
router.get('/noticias', restritoControl.noticia.bind(null, noticiaModel))

module.exports = router