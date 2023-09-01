const mongoose = require("mongoose");
const Component = require('./componentModel');

var recipeSchema = new mongoose.Schema({
  name: String,
  components: [
    {
      component: { type: mongoose.Schema.Types.ObjectId, ref: 'Component' },
      quantity: Number,
    },
  ]
},
{
  collection: 'Recipes'
});

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;