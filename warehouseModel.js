const mongoose = require("mongoose");

var warehouseSchema = new mongoose.Schema({

  name: {

    type: String,

    required: true,
    unique: true,
  }
},
{
  collection: 'Warehouses' // Tu możesz określić nazwę kolekcji
});

const Warehouse = mongoose.model("Warehouse", warehouseSchema);

module.exports = Warehouse;