
const mongoose = require("mongoose")

const categoriesSchema = new mongoose.Schema({
    name:{
        type:String
    },
    status:{
    type:String
     },
     product_id:[
         {
            type: 'ObjectId',
            ref: 'Product',
         }
     ]
     
    
})

var Category = new mongoose.model("Category",categoriesSchema);
module.exports = Category;