const SportModel = require('../models/sport')

module.exports.info = async (ctx) => {
  try {
    let { keyword, page } = ctx.request.query
    const filter = {}
    if (keyword && keyword.length > 0) {
      filter.name = { $regex: keyword }
    }
    const sportList = await SportModel
      .find(filter)
      .skip((page - 1) * 20)
      .limit(20)

    ctx.body = {
      code: 200,
      data: sportList
    }
  } catch (e) {
    console.log(e)
    ctx.body = {
      code: 500,
      message: 'Request error!'
    }
  }
}
