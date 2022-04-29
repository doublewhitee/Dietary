const RecommendModel = require('../models/recommend')

module.exports.info = async (ctx) => {
  try {
    let { gender, age } = ctx.request.body
    const info = await RecommendModel.find({
      minAge: { $lte: age },
      maxAge: { $gte: age },
      gender
    })
    ctx.body = {
      code: 200,
      data: info
    }
  } catch (e) {
    console.log(e)
    ctx.body = {
      code: 500,
      message: 'Request error!'
    }
  }
}