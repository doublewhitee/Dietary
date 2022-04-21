const mongoose = require('mongoose')

const Schema = mongoose.Schema

const sportSchema = new Schema({
  name: { type: String, required: true },
  calorie: { type: Number, required: true } // Calories per kg per min
})

const Sport = mongoose.model('Sport', sportSchema)

module.exports = Sport
