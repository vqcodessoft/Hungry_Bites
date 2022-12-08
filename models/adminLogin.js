const mongoose = require("mongoose")
//var bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
    name:{
        type:String
    },
    username:{
        type:String
    },
    email:{
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
    },
    
             
    
    // category:[
    //     {
    //         type: 'ObjectId',
    //         ref: 'Category',
    //     }
    // ]
    
})

// adminSchema.pre('save', async function(next){

//     try{
//         var salt = bcrypt.genSaltSync(10);
//           const hashedPassword = await bcrypt.hash(this.password, salt)
//           this.password=hashedPassword;
//         next()
//     }catch(error){
//         next(error)
//     }
   
// })

var AdminLogin = new mongoose.model("AdminLogin",adminSchema);
module.exports = AdminLogin;