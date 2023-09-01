const mongoose = require("mongoose");

var questionSchema = new mongoose.Schema({

  "Question": {

    type: String,

    required: 'This field is required'

  },

  "Option A": {

    type: String,

    required: 'This field is required'

  },

  "Option B": {

    type: String,

    required: 'This field is required'

  },

  "Option C": {

    type: String,

    required: 'This field is required'

  },

  "Option D": {

    type: String,

    required: 'This field is required'

  },

  "Answer": {

    type: String,

    required: 'This field is required'

  }

});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;