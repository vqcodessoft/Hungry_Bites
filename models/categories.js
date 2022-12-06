const mongoose = require("mongoose")

const categoriesSchema = new mongoose.Schema({
    name:{
        type:String
    },
    username:{
        type:String
    },
    password:{
        type:String
    },

    admine:[
        {
            type: 'ObjectId',
            ref: 'AdminLogin',
        }
    ]
})

var Category = new mongoose.model("Category",categoriesSchema);
module.exports = Category;