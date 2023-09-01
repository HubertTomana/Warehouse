const express = require('express');

const router = express.Router();

const mongoose = require("mongoose");

const mongooseConnection = require('./server');

const Question = mongoose.model("Question")

const multer = require("multer"); 

var upload = multer({dest: "uploads/"})

const ExcelJS = require('exceljs');

const xlsx = require('xlsx'); 
const fs = require('fs-extra');

router.get('/readExcel', (req, res) => {
    const workbook = xlsx.readFile('Zeszyt1.xlsx');  
    let workbook_sheet = workbook.SheetNames;                
    let workbook_response = xlsx.utils.sheet_to_json(        
      workbook.Sheets[workbook_sheet[0]]
    );
    res.status(200).send(workbook_response);
});

router.get('/saveExcel', async (req, res) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('DataSheet');

    const customHeaders = ['Question', 'Option A', 'Option B', 'Option C', 'Option D', 'Answer'];

    worksheet.columns = customHeaders.map(header => ({
        header: header,
        key: header,
        width: 15
    }));

    try {
    const questions =  await Question.find({});
    console.log(questions);
        questions.forEach(item => {
            // console.log("Question wynosi : ", item.Question);
            // console.log("Opcja A wynosi : ", item["Option A"]);
            const rowData = {
                'Question': item.Question,
                'Option A': item["Option A"],
                'Option B': item["Option B"],
                'Option C': item["Option C"],
                'Option D': item["Option D"],
                'Answer': item.Answer
            };
            //console.log("Row data to : ", rowData)
            worksheet.addRow(rowData);
        });
        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            console.log(`Row ${rowNumber}: ${JSON.stringify(row.values)}`);
        });
        // console.log('Before writing Excel file');
        await workbook.xlsx.writeFile('output.xlsx');
        // console.log('After writing Excel file');

        console.log('Excel file saved');
        res.status(200).send('Excel file saved');
    } catch (error) {
        console.error ('Error saving Excel file : ', error);
        res.status(500).send('Error saving Excel file.');
    }
});

router.post('/uploadExcel', upload.single('file'), (req, res) => {
    console.log("1");
    try {
        if (req.file?.filename == null || req.file?.filename == 'undefined') {
            res.status(400).json("No File")
        } else {          
            console.log("1");
            var filePath = 'uploads/' + req.file.filename
            console.log("2");
            const workbook = xlsx.readFile(filePath);  
            console.log("3");
            let workbook_sheet = workbook.SheetNames; 
            console.log("4");             
            let workbook_response = xlsx.utils.sheet_to_json(        
                workbook.Sheets[workbook_sheet[0]]
            );
            console.log("5");
            //var question = new Question();
            console.log("6");
            // question["Question"] = workbook_response.message[0].Question;
            // question["Option A"]= workbook_response.message[0]["Option A"];
            // question["Option B"] = workbook_response.message[0]["Option B"];
            // question["Option C"] = workbook_response.message[0]["Option C"];
            // question["Option D"] = workbook_response.message[0]["Option D"];
            // question["Answer"] = workbook_response.message[0].Answer;
            workbook_response.forEach(item => {
                 
                const newQuestion = new Question({
                    "Question": item.Question,
                    "Option A": item["Option A"],
                    "Option B": item["Option B"],
                    "Option C": item["Option C"],
                    "Option D": item["Option D"],
                    "Answer": item.Answer
                });
                    newQuestion.save()
                        .then(savedQuestion => {
                            console.log("Saved entry: ", savedQuestion);
                        })
                        .catch(error => {
                            console.log("Error while saving entry :", error);
                        });
            });
            // console.log("7");   
            // question.save((err, doc) => {
            //     if (!err) {
            //         console.log("Wyslane do bazy");
            //     } else {
            //         console.log("Blad przy insercie : " + err);
            //     }
            // });
            console.log("8");
             res.status(200).send({                                   
                 message: workbook_response,
            });
            fs.remove(filePath)
        }
    } catch (error) {
        res.status(500)
    }
});

module.exports = router;



