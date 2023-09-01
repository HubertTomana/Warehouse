const mongoose = require('mongoose');

const typeDataSchema = new mongoose.Schema({
  name: String,
  nameValues: [String], // Dostępne nazwy dla danego typu
  colourValues: [String], // Dostępne kolory dla danego typu
},{
    collection: 'TypeData'
});

const TypeData = mongoose.model('TypeData', typeDataSchema);

module.exports = TypeData;