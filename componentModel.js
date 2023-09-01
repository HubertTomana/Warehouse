const mongoose = require("mongoose");

var componentSchema = new mongoose.Schema({

  "type": {

    type: String,

    //required: 'This field is required'

  },

  "name": {

    type: String,

    //required: 'This field is required'

  },

  "colour": {

    type: String,

    //required: 'This field is required'

  },

  "amount": {

    type: Number,

    //required: 'This field is required'

  },

  warehouse: { 

    type: String,

  }
},
{
  collection: 'Components' // Tu możesz określić nazwę kolekcji
});

const Component = mongoose.model("Component", componentSchema);

module.exports = Component;