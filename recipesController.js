const express = require('express');

const router = express.Router();

const mongoose = require("mongoose");

const mongooseConnection = require('./server');

const Component = mongoose.model("Component")

const Recipe = mongoose.model('Recipe')

const multer = require("multer"); 

var upload = multer({dest: "uploads/"})

const ExcelJS = require('exceljs');

const xlsx = require('xlsx'); 
const fs = require('fs-extra');

router.get('/', async (req, res) => {
    try {
        const recipes = await Recipe.find({});
        res.status(200).send(recipes);
    } catch (error) {
        console.error ('Error in getting Recipes from Database : ', error);
        res.status(500).send('Error in getting Recipes from Database');
    }
});

// router.get('/getComponents', async (req, res) => {
//     try {
//         const { selectedComponents } = req.body;
//         const processedComponents = [];
//         for (const componentData of selectedComponents) {
//             const componentId = componentData.component;
//             const quantity = componentData.quantity;
//             const component = await Component.findById(componentId);
//             processedComponents.push({
//                 component: component.name,
//                 quantity: quantity
//               });
//         }
  
//         res.status(200).json({ message: 'Successfully processed selected components.', processedComponents });
//     } catch (error) {
//       console.error('Error fetching components:', error);
//       res.status(500).json({ error: 'An error occurred while fetching components' });
//     }
//   });


router.get('/recipes', async (req, res) => {
    try {
      const recipes = await Recipe.find().populate('components.component', '-_id type name colour'); // Populacja komponentów z nazwami
        console.log(recipes);
      res.status(200).json(recipes);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'An error occurred.' });
    }
  });


router.post('/addRecipe', async (req, res) => {
    const postData = req.body;
    try {
        //const existingComponent = await Component.findOne({ name: postData.name });
        const { name, components } = req.body;
        const newRecipe = new Recipe({
            name,
            components,
          })
        const savedRecipe = await newRecipe.save();
        res.status(201).json(savedRecipe);
    } catch (error) {
        console.error('Error creating recipe:', error);
        res.status(500).json({ error: 'Failed to create recipe' });
    };
})



module.exports = router;



