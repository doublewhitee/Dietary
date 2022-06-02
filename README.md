# Dietary

**Dietary** is an open data driven application for calorie calculation and diet analysis.

Our project can also be accessed [here](https://dietaryy.herokuapp.com/).

## Tech stack

The frontend of this project uses vue 3.0 + typescript + quasar + vuex + vue-router + axios + vite, and the backend is implemented by koa2.js, and the database uses MongoDB.

+ **vue3.0**: a JavaScript framework for building user interfaces

+ **quasar**: UI component framework

+ **echarts & vue-echarts**: draw charts

+ **sass**: CSS extension language

+ **mongoose**: an Object Data Modeling (ODM) library for MongoDB and Node.js

## Installation

```bash
# frontend
# install dependencies
yarn # or npm i
# start a dev server
yarn start
# build
yarn build

# backend
cd server
# install dependencies
yarn # or npm i
# insert data into database
node ./script/index.js # our datasets are in ./script/data
yarn dev
```

## Features

+ **Calorie Calculator**: calculate the user's intake and comsumption value of calorie

+ **Diet Analysis**: analyse user's diets using visualisations. Including Calories Analysis, Three Major Nutrients, Nutrient Analysis.

+ **Food Nutrients Search**: search the food nutrition information

+ **User Info Edit**: edit user basic information (for calculating the value of **calorie budget**)

+ **Mode**: the light / dark mode

## Screenshots

on PC

<img title="" src="https://github.com/doublewhitee/Dietary/blob/main/screenshot/pc_1.PNG?raw=true" alt="img" data-align="inline" width="432">

on Mobile (light / dark mode)

<img title="" src="https://github.com/doublewhitee/Dietary/blob/main/screenshot/mobile_1.PNG?raw=true" alt="img" width="130" data-align="inline">     <img src="https://github.com/doublewhitee/Dietary/blob/main/screenshot/mobile_2.PNG?raw=true" title="" alt="img" width="130">

Diet Analysis & Food Nutrients Search

<img title="" src="https://github.com/doublewhitee/Dietary/blob/main/screenshot/mobile_3.PNG?raw=true" alt="img" width="130" data-align="inline">     <img src="https://github.com/doublewhitee/Dietary/blob/main/screenshot/mobile_4.PNG?raw=truee" title="" alt="img" width="130">
