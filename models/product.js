const mongoose = require("mongoose")

const categoriesSchema = new mongoose.Schema({
    name:{
        type:String
    },
     Category_type:{
    type:String
     },
     address:{
         type:String
     },
     phone_no:{
         type:String
     },
     cat_id:{
        type: 'ObjectId',
        ref: 'Category',
     },
     status:{
         type:String
     },
     sort_order:{
        type:String
     },
     restaurant_name:{
        type:String
     },
     city:{
        type:String
     },
   land_mark:{
    type:String
   },
   opening_day:[{
    type:String
   }],
   opening_time:{
    type:String
   },
   closing_time:{
    type:String
   },
   profile:[{
       type:String
   }],
     menu_item:[
         {
            type: 'ObjectId',
            ref: 'MenuItem',
         }
     ]
    
})

var Products = new mongoose.model("Product",categoriesSchema);
module.exports = Products;