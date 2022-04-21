const food = require('./food')
const sport = require('./sport')

const router = app => {
  app.use(food.routes(), food.allowedMethods())
  app.use(sport.routes(), sport.allowedMethods())
}

module.exports = router
