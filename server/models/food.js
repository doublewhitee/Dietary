const mongoose = require('mongoose')

const Schema = mongoose.Schema

const foodSchema = new Schema({
  name: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  unit: { type: String, required: true },
  calorie: { type: Number, required: true },
  nutrition: [{
    name: String,
    value: Number
  }]
})

const Food = mongoose.model('Food', foodSchema)

module.exports = Food
