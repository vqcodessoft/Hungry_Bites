const mongoose = require("mongoose")

const menuItemSchema = new mongoose.Schema({
    item_name:{
        type:String
    },
    item_details:{
    type:String
     },
     price:{
         type:String
     },
     discount:{
         type:String
     },
     profile:{
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