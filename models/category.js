
const mongoose = require("mongoose")

const categoriesSchema = new mongoose.Schema({
    name:{
        type:String
    },
    status:{
    type:String
     },
     profile:{
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





// {
//     "name": "Super Market",
//     "status": "active",
//     "profile": "profile_1670933029858.png",
//     "product_id": [],
//     "_id": "63986a25829645adc7ea953c",
//     "__v": 0
// }


// {
//     "name": "Restaurants",
//     "status": "active",
//     "profile": "profile_1670933225711.png",
//     "product_id": [],
//     "_id": "63986ae9829645adc7ea953f",
//     "__v": 0
// }