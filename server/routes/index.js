const food = require('./food')
const sport = require('./sport')
const recommend = require('./recommend')

const router = app => {
  app.use(food.routes(), food.allowedMethods())
  app.use(sport.routes(), sport.allowedMethods())
  app.use(recommend.routes(), recommend.allowedMethods())
}

module.exports = router
