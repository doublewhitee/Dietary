const food = require('./food')

const router = app => {
  app.use(food.routes(), food.allowedMethods())
}

module.exports = router
