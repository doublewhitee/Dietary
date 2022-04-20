const FoodModel = require('../models/food')
const CategoryModel = require('../models/category')

module.exports.info = async (ctx) => {
  try {
    let { keyword, page, category } = ctx.request.query
    const filter = {}
    if (keyword && keyword.length > 0) {
      filter.name = { $regex: keyword }
    }
    if (category) {
      filter.category = category
    }
    const foodList = await FoodModel
      .find(filter)
      .populate('category', 'name')
      .skip((page - 1) * 20)
      .limit(20)

    ctx.body = {
      code: 200,
      data: foodList
    }
  } catch (e) {
    console.log(e)
    ctx.body = {
      code: 500,
      message: 'Request error!'
    }
  }
}
