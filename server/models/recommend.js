const mongoose = require('mongoose')

const Schema = mongoose.Schema

const recommendSchema = new Schema({
  gender: { type: String, required: true },
  minAge: { type: Number, required: true },
  maxAge: { type: Number, required: true },
  nutrition: [{
    name: String,
    value: Number
  }]
})

const Recommend = mongoose.model('Recommend', recommendSchema)

module.exports = Recommend
