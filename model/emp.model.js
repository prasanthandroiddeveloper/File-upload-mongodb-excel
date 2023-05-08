const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const data = Schema({

    name: {
        type: String,
    },
    age: {
        type: String,
    }
})
module.exports = mongoose.model("data", data)