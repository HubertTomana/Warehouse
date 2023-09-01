const express = require('express');

const router = express.Router();

const mongoose = require("mongoose");

const mongooseConnection = require('./server');

const Component = mongoose.model("Component")

const Option = mongoose.model("Option")

const TypeData = mongoose.model('TypeData')

const Warehouse = mongoose.model('Warehouse')

const Recipe = mongoose.model('Recipe')

const multer = require("multer"); 

var upload = multer({dest: "uploads/"})

const ExcelJS = require('exceljs');

const xlsx = require('xlsx'); 
const fs = require('fs-extra');

router.get('/', async (req, res) => {
    try {
        const components = await Component.find({});
        res.status(200).send(components);
    } catch (error) {
        console.error ('Error in getting Components from Database : ', error);
        res.status(500).send('Error in getting Components from Database');
    }
});

router.get('/options', async (req, res) => {
    try {
        const options = await Option.find({});
        res.status(200).send(options);
    } catch (error) {
        console.error ('Error in getting Options from Database : ', error);
        res.status(500).send('Error in getting Options from Database');
    }
});

router.get('/typeData', async (req, res) => {
    try {
        const typeData = await TypeData.find({});
        res.status(200).send(typeData);
    } catch (error) {
        console.error ('Error in getting Options from Database : ', error);
        res.status(500).send('Error in getting Options from Database');
    }
});

router.get('/components', async (req, res) => {
    try {
      const searchTerm = req.query.search; // Parametr zapytania - wyszukiwana fraza
      const field = req.query.field;
      
    //   if (!searchTerm) {
    //     const components = await Component.find();
    //     res.status(200).json(components);
    //   } else {
        // Wykorzystanie MongoDB i Mongoose do wyszukiwania produktów
        const components = await Component.find({ [field]: { $regex: searchTerm, $options: 'i' }});
        //const query = { [field]: new RegExp(searchTerm, 'i') }; // Używamy wybranego pola do filtrowania
        //const components = await Component.find(query);
        res.status(200).json(components);
    //}
      
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.get('/warehouses', async (req, res) => {
    try {
        const warehouses = await Warehouse.find({});
        res.status(200).send(warehouses);
    } catch (error) {
        console.error ('Error in getting Warehouses from Database : ', error);
        res.status(500).send('Error in getting Warehouses from Database');
    }
});

router.post('/addComponent', async (req, res) => {
    const postData = req.body;
    try {
        //const existingComponent = await Component.findOne({ name: postData.name });
        const existingComponent = await Component.findOne({$and: [ {type: postData.type}, {name: postData.name}, {colour: postData.colour} ]});
        if (existingComponent) {
            //Add amount to the existing component
            existingComponent.amount += postData.amount;
            await existingComponent.save();
            res.status(200).json({ message: 'Component has been updated', data: existingComponent });
          } else {
            // Add new component
            const newComponent = new Component(postData);
            await newComponent.save();
            res.status(201).json({ message: 'Component has beed added', data: newComponent });
          }
        } catch (error) {
            console.error ('Problem in post method warehousecontroller : ', error);
            res.status(500).send('Problem in post method warehousecontroller');
        }
});

router.post('/addfromexcel', upload.single('file'), async(req, res) => {
    try {
        if (req.file?.filename == null || req.file?.filename == 'undefined') {
            res.status(400).json("No File")
        } else {  
            var filePath = 'uploads/' + req.file.filename
            const workbook = xlsx.readFile(filePath);  
            let workbook_sheet = workbook.SheetNames;
            let workbook_response = xlsx.utils.sheet_to_json(        
                workbook.Sheets[workbook_sheet[0]]
            );
            for (const item of workbook_response) {
                try {
                //const existingComponent = await Component.findOne({ name: item.name });
                const existingComponent = await Component.findOne({$and: [ {type: item.type}, {name: item.name}, {colour: item.colour}, {warehouse: item.warehouse} ]});
                if (existingComponent) {
                    existingComponent.amount += item.amount;
                    await existingComponent.save();
                    //res.status(200).json({ message: 'Component has been updated', data: existingComponent });
                }
                else {
                const newComponent = new Component({
                    "type": item.type,
                    "name": item.name,
                    "colour": item.colour,
                    "amount": item.amount,
                    "warehouse": item.warehouse
                });
                await newComponent.save()
                }
            } catch (error) {
                console.log("Error while processing entry:", error);
            }};
             res.status(200).send({                                   
                 message: workbook_response,
            });
            fs.remove(filePath)
        }
    } catch (error) {
        res.status(500)
    }
})

router.put('/edit/:id', async (req, res) => {
    try {
        componentId = req.params.id;
        const updatedComponent = req.body;
        const componentToUpdate = await Component.findById(componentId);
        if (!componentToUpdate) {
          return res.status(404).json({ error: 'There is no component with this id' });
        }
      
        // Aktualizuj dane produktu
        componentToUpdate.type = updatedComponent.type || componentToUpdate.type;
        componentToUpdate.name = updatedComponent.name || componentToUpdate.name;
        componentToUpdate.colour = updatedComponent.colour || componentToUpdate.colour;
        componentToUpdate.amount = updatedComponent.amount || componentToUpdate.amount;
        componentToUpdate.warehouse = updatedComponent.warehouse || componentToUpdate.warehouse;
        console.log(componentToUpdate);
        console.log(updatedComponent);
        await componentToUpdate.save();
        res.status(200).json({ message: 'Component has been updated', data: componentToUpdate });
      } catch(error) {
        console.error ('Error in edit Component from Database : ', error);
        res.status(500).send('Error in edit Component from Database');
      }
    });

    router.delete('/delete/:id', async (req, res) => {
        const componentId = req.params.id;
      
        try {
          const deletedComponent = await Component.findByIdAndDelete(componentId);
          if (!deletedComponent) {
            return res.status(404).json({ message: 'Component not found' });
          }
          await Recipe.deleteMany({ 'components.component': componentId });
          res.status(200).json({ message: 'Component deleted successfully' });
        } catch (error) {
          console.error('Error deleting Component from Database : ', error);
          res.status(500).json({ message: 'Error deleting Component from Database' });
        }
      });

module.exports = router;



