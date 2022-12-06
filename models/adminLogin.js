const mongoose = require("mongoose")

const adminSchema = new mongoose.Schema({
    username:{
        type:String
    },
    password:{
        type:String
    },
    type:{
        type:String
    },
    category:[
        {
            type: 'ObjectId',
            ref: 'Category',
        }
    ]
    
})

var AdminLogin = new mongoose.model("AdminLogin",adminSchema);
module.exports = AdminLogin;