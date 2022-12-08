const mongoose = require("mongoose")

const menuItemSchema = new mongoose.Schema({
    product_name:{
        type:String
    },
    description:{
    type:String
     },
     price:{
         type:String
     },
     product_id:{
        type: 'ObjectId',
        ref: 'Product',
     },
     cat_id:{
        type: 'ObjectId',
        ref: 'Category',
     },
    
    
})

var MenuItem = new mongoose.model("MenuItem",menuItemSchema);
module.exports = MenuItem;