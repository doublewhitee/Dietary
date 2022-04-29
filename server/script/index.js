// node ./script/index.js
const path = require('path')
const mongoose = require('mongoose')
const csv = require('csvtojson')

const url = 'mongodb://localhost:27017/calorie'

const Category = require('../models/category')
const Food = require('../models/food')
const Sport = require('../models/sport')
const Recommend = require('../models/recommend')

// read File [Diet Nutritional Data]
// insert Category func
const getCate = async () => {
  try {
    const res = await csv().fromFile(path.join(__dirname, '/data/Diet Nutritional Data.csv'))
    // category set
    const set = new Set()
    res.forEach(i => {
      if (!set.has(i.Category)) {
        set.add(i.Category)
      }
    })
    // create insert data
    const insertData = []
    for (let i of Array.from(set.keys())) {
      insertData.push({ name: i })
    }
    // insert many
    await Category.insertMany(insertData)
    console.log('Category inserted successfully!')
  } catch(e) {
    console.log('Category insert error!')
  }
}

// insert Food func
const getFood = async () => {
  try {
    const res = await csv().fromFile(path.join(__dirname, '/data/Diet Nutritional Data.csv'))
    const cates = await Category.find()
    const insertData = []
    for (let item of res) {
      const temp = { nutrition: [] }
      for (let key of Object.keys(item)) {
        if (key === 'Name') {
          temp.name = item[key]
        } else if (key === 'Category') {
          const cate_id = cates.find(i => {
            if (i.name === item[key]) {
              return i._id
            }
          })
          temp.category = cate_id
        } else if (key === 'Calories (kcal)') {
          temp.calorie = parseFloat(item[key])
        } else if (key === 'Unit') {
          temp.unit = item[key]
        } else {
          temp.nutrition.push({ name: key, value: parseFloat(item[key]) })
        }
      }
      insertData.push(temp)
    }
    // insert many
    await Food.insertMany(insertData)
    console.log('Food inserted successfully!')
  } catch(e) {
    console.log('Food insert error!')
  }
}

// insert Sport func
const getSport = async () => {
  try {
    const res = await csv().fromFile(path.join(__dirname, '/data/Exercise Calorie Cosuming.csv'))
    const insertData = []
    res.forEach(i => {
      insertData.push({ name: i['Activity, Exercise or Sport'], calorie: i['Calories per kg per min'] })
    })
    await Sport.insertMany(insertData)
    console.log('Recommend inserted successfully!')
  } catch (e) {
    console.log('Recommend insert error!')
  }
}

// insert Recommend func
const getRecommend = async () => {
  try {
    const res = await csv().fromFile(path.join(__dirname, '/data/Nutrient Reference Intake.csv'))
    const insertData = []
    res.forEach(i => {
      const temp = { nutrition: [] }
      for (let key of Object.keys(i)) {
        if (key === 'minAge') {
          temp[key] = i[key]
        } else if (key === 'maxAge') {
          temp[key] = i[key]
        } else if (key === 'gender') {
          temp[key] = i[key]
        } else {
          temp.nutrition.push({ name: key, value: i[key] })
        }
      }
      insertData.push(temp)
    })
    await Recommend.insertMany(insertData)
    console.log('Recommend inserted successfully!')
  } catch (e) {
    console.log('Recommend insert error!')
  }
}

// connect
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
const conn = mongoose.connection
conn.on('open', async () => {
  console.log('DB connect success!')
  await getCate()
  await getFood()
  await getSport()
  await getRecommend()
  console.log('Done!')
  mongoose.disconnect()
})
