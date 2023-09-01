const mongoose = require("mongoose");

var optionSchema = new mongoose.Schema({

  "name": {

    type: String,

    required: true,
    unique: true,
  },
  "isTyped": {
    type: Boolean,
    required: true,
  },

  "isList": {
    type: Boolean,
    required: true,
},
  // "listValues": {
  //   type: [String],
  //   required: function() {
  //     return this.isList;
  //   },
  // },
},
{
  collection: 'Options' // Tu możesz określić nazwę kolekcji
});

const Option = mongoose.model("Option", optionSchema);

module.exports = Option;