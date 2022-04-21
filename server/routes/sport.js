const router = require('koa-router')()
const sport_controller = require('../controllers/sport')

router.prefix('/sport')

// get sport list
router.get('/info', sport_controller.info)

module.exports = router
