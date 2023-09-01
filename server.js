const express = require('express');
const mongoose = require('mongoose');
//const router = require('./excel-read-route'); 
const Component = require('./componentModel') 
const Option = require('./optionModel')
const TypeData = require('./typeDataModel')
const Recipe = require('./recipeModel')
const Warehouse = require('./warehouseModel')
//const excelController2 = require('./excelController2'); //
const warehouseController = require('./warehouseController');
const recipesController = require('./recipesController');
const cors = require('cors');
const url = 'mongodb://127.0.0.1:27017/Magazyn'

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,POST,PUT,DELETE',
  //allowedHeaders: 'Content-Type,Authorization',
};

//middleware do obsługi CORS
//app.use(cors());
app.use(cors(corsOptions));

app.use(express.json());

mongoose.connect(url, {})
    .then(result => console.log("database connected"))
    .catch(err => console.log(err));

const conn = mongoose.connection;

//app.use('/excel', router);
//app.use('/excel', excelController2)
app.use('/warehouse', warehouseController);
app.use('/recipes', recipesController);

app.listen(8000, () => {
  console.log('App is running on Port 8000');
});

module.exports = conn;