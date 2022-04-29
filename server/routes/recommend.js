const router = require('koa-router')()
const recommend_controller = require('../controllers/recommend')

router.prefix('/recommend')

// post recommend data
router.post('/info', recommend_controller.info)

module.exports = router
