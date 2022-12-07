const mongoose = require("mongoose")

const adminSchema = new mongoose.Schema({
    name:{
        type:String
    },
    username:{
        type:String
    },
    password:{
        type:String
    },
    type:{
        type:String
    },
    product_id:{
        type: 'ObjectId',
       ref: 'Product',
    },
    subscription:{
        type:String
    }

    // category:[
    //     {
    //         type: 'ObjectId',
    //         ref: 'Category',
    //     }
    // ]
    
})

var AdminLogin = new mongoose.model("AdminLogin",adminSchema);
module.exports = AdminLogin;