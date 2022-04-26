const router = require('koa-router')()
const food_controller = require('../controllers/food')

router.prefix('/food')

// get food list
router.get('/info', food_controller.info)

// get category list
router.get('/cate', food_controller.category)

module.exports = router
