const router         = require('express').Router()
const noticiaModel   = require('../models/noticias')
const noticiaControl = require('../controllers/noticia')

router.get('/', noticiaControl.index.bind(null, noticiaModel))

module.exports = router