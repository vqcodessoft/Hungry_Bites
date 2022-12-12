const express = require('express')
const app = express()
//const bodyParser = require("body-parser");
const cors = require("cors");
//var bcrypt = require('bcryptjs');
require("./database/databaseConn")
const AdminLogin = require("./models/adminLogin")
const Products = require("./models/product")
const Category = require("./models/category")
const MenuItem = require("./models/metuItem")
const multer = require("multer");
//const fs = require("fs");
const path = require("path");
app.use(cors());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
app.use(express.json())

app.get("/owner",(req,res)=>{
    res.send("Hello World")
})




const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})
const upload = multer({ storage: storage })
// const storage = multer.diskStorage({
//     destination: './public/images',
//     filename: (req, file, cb) => {
//         return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
//     }
// })


///--------------------------   -POST Request API BOX --   ------------------------------//
 
//user signup 
app.post("/signup", async (req, res) => {
    const {name,username,email, password,type} = req.body
    if (!name || !username || !email || !password || !type ) {
        res.status(301).json({ message: "Please require all field" })
    }
    try {

        const findUser = await AdminLogin.findOne({ username: username })
        if (findUser) {
            return res
                .status(422)
                .json({ error: " username already exists" });
        }
        const user = await new AdminLogin({name, username,email, password,type })
        if(type!=="user"){
            return res
            .status(422)
            .json({ error: "Invalid Type" });
        }

        const userRegister = await user.save()
        if (userRegister) {
            res.status(201).json({ data: user, message: "User Signup successfully" });
        }

    } catch (err) {
       res.status(400).send(err)
    }

})

//login
app.post("/login",async(req,res)=>{
   const {username,password} = req.body;
    if(!req.body.username ||!req.body.password ){
        res.status(301).json({message:"Please fill username/password" })
    }
    try{
           const category = await Category.find({})
        const data = await AdminLogin.findOne({username:username}).populate('product_id')
              
                 let result = ( data.type==='user' || 'Owner') ? category : ""
              if(data){
               // var match =await  bcrypt.compare(password,data.password)

                    if(password===data.password){
                        res.status(201).send({
                             message: "Login Successfully ", 
                             type:data?.type, 
                             name:data.name,
                             _id:data?._id,
                              all_category:result,
                             product_id:data?.product_id?._id?data?.product_id?._id:"",
                             product_name:data?.product_id?.name,
                             product_status:data?.product_id?.status
                          
                        })
                    }else{
                        res.send({ message: "password  didn't match" })
                    }

              }else{
                res.status(302).send({ message: "User not register " })
              }
    }
    catch(error){
        console.log(error)
    }
})

//update password method
 app.post("/update_password",async(req,res)=>{
     try{
         const admin_id = req.body.admin_id
          const  password = req.body.password
   
          const data = await AdminLogin.findOne({_id:admin_id})
            if(data){

            const adminData =  await AdminLogin.findByIdAndUpdate({_id:admin_id},{$set:{
                password:password
               }})
               res.status(201).send({success:true,message:"Password has been Updated!"})
            }else{
                res.status(201).send({success:false,message:"Owner Id Not found!"})
            }

     }catch(error){
         res.status(400).send(error.message)
     }
 })


//Product
app.post("/products",async(req,res)=>{
       const {name,username,password,type,Category_type,subscription,address,phone_no,cat_id,status,sort_order} = req.body;
       
       if(!name ||!username|| !password ||!type){
        res.status(301).json({message:"Please fill username/password" })
       }
       try{
          
            const {cat_id} = req.body;
            if(type!=="admin"){
                return res
                .status(422)
                .json({ error: "Invalid Type" });
            }


           const data = await new Products({name,Category_type,address,phone_no,cat_id,status,sort_order})
              const category = await Category.findById(cat_id)
              await category?.product_id?.push(data)
            const findUser = await AdminLogin.findOne({ username: username })
        if (findUser) {
            return res
                .status(422)
                .json({ error: " username already exists" });
        }

                   //const product_id  = data._id
                 data.save((err)=>{
                     if(!err){
                         res.status(201).send({products:data})
                          const admins = new AdminLogin({name,username,password,type,subscription,status})
                          
                          admins.save()
                            // admin?.category?.push(data._id)
                     }else{
                         res.send(err)
                     }
                 })

                  await category?.save()
       }catch(error){
          res.status(400).send(error.message)
       }
})





app.use('/category', express.static('public/images'));
//Category
app.post("/category",upload.single("profile"),async(req,res)=>{
    let profile = (req.file) ? req.file.filename : null
          const {name,status}=req.body
        //    if(!name || !status){
        //     res.status(301).json({message:"Please fill name/status" })
        //    }
           try{
               const category= await new Category({name,status,profile})
               console.log("category---->",category)
               await category.save((err) => {
                if (err) {
                    res.send(err)
                } else {
                    res.status(201).json(category)
                }
            })

           }catch(err){
               res.send(err.message)
           }

})

//Menu Item for product
app.post("/menu_item",async(req,res)=>{
    const {product_name,description,price,product_id,cat_id} = req.body

    try{
        const menuItem = await new MenuItem({product_name,description,price,product_id,cat_id})
         const product = await Products.findById(product_id)
            await product?.menu_item?.push(menuItem)

            menuItem.save((err)=>{
                if(err){
                    res.status(400).send(err)
                }else{
                    res.status(201).send(menuItem)
                }
            })

           await product?.save()

    }catch(error){
        res.status(400).send(error)
    }
})

//--------------------------------------------------Get Request API BOX ------------------------------------->
const imagerurl=['public/images/image_2022_12_12T06_13_21_468Z.png','public/images/image_2022_12_12T06_13_21_468Z.png','public/images/image_2022_12_12T06_10_15_814Z.png']
app.get("/icon",(req,res)=>{
 res.send(imagerurl)
})
//get category----
app.get("/find-category",async(req,res)=>{

    try{
        const findCategory = await Category.find({}).populate('product_id')
             res.status(201).send({data:findCategory})

    }catch(error){
        res.status(400).send(error)
    }
})
// get category with Id
app.get("/find-category/:id",async(req,res)=>{

    try{
        const id = req.params.id
        const findCategory = await Category.findById(id).populate('product_id')
             res.status(201).send(findCategory)

    }catch(error){
        res.status(400).send(error)
    }
})




// get product-----
app.get("/find-products",async(req,res)=>{
    try{
        const findProduct = await Products.find({}).populate('menu_item')
        res.status(201).send(findProduct)

    }catch(error){
        res.status(400).send(error)
    }
})
//get product----- with Id
app.get("/find-products/:id",async(req,res)=>{
    try{
        const id = req.params.id
        const findProduct = await Products.findById(id).populate('menu_item')
        res.status(201).send(findProduct)

    }catch(error){
        res.status(400).send(error)
    }
})




//get Menu Items ------
  app.get("/find-menuItem",async(req,res)=>{
    try{
        const findMenuItem = await MenuItem.find({})
        res.status(201).send(findMenuItem)

    }catch(error){
        res.status(400).send(error)
    }
})

//get Menu Items ------with id
app.get("/find-menuItem/:id",async(req,res)=>{
    try{

        const id = req.params.id
        const findMenuItem = await MenuItem.findById(id)
        res.status(201).send(findMenuItem)

    }catch(error){
        res.status(400).send(error)
    }
})


//----------------------------------------------------------------delete Request API Box--------------------->

//Delete product and category inside product Id and admin and menuItem
app.delete("/delete_products-category/:id",async(req,res)=>{
    try{

        const delete_product= await Products.findByIdAndDelete(req.params.id)
        const delete_menuItem= await MenuItem.deleteMany({"product_id":req.params.id})
        const deleteAdmin= await AdminLogin.deleteOne({"product_id":req.params.id})
        const delete_category= await Category.updateMany({},{$pull:{product_id:{$in:[req.params.id]}}})
          if(!req.params.id){
              return   res.status(400).send({message:"Pass Id"})
          }
          res.status(201).send({message:"Product Delete Successfully",delete_product})

    }catch(err){
        console.log(err)
    }
})

//Menu Item Delete
app.delete("/delete-menuItem/:id",async(req,res)=>{
    try{

        const delete_menuItem= await MenuItem.findByIdAndDelete(req.params.id)
        
        const delete_menuId= await Products.updateMany({},{$pull:{menu_item:{$in:[req.params.id]}}})
       
          if(!req.params.id){
              return   res.status(400).send({message:"Pass Id"})
          }
          res.status(201).send(delete_menuItem)

    }catch(err){
        console.log(err)
    }
})

//delete category and category inside product also delete
const allProduct=[];
app.delete("/delete_category-with-insideProduct/:id",async(req,res)=>{
      try{
        const delete_Category= await Category.findByIdAndDelete(req.params.id)
        const delete_product= await Products.deleteOne({"cat_id":req.params.id})
        const delete_MenuItem= await MenuItem.deleteMany({"cat_id":req.params.id})
       // const delete_product= await Products.updateMany({},{$pull:{cat_id:{$in:{id}}}})
       
          if(!req.params.id){
              return   res.status(400).send({message:"Pass Id"})
          }
          res.status(201).send(delete_Category)

      }
      catch(error){
          res.status(301).send(error)
      }
})




module.exports=app;


























//////////////////////////////////////////////////
//delete category and category inside product also delete
// app.delete("/delete_category-with-insideProduct/:id",async(req,res)=>{
//     try{
//       const productList = await Products.find({})
//       const data = await Category.find({"product_id":req.params.id})
//       productList.forEach(x=>{
//             console.log(">>>x>>xx",x?._id)
//             allProduct.push(x?._id)
//                    let productId = x?._id.valueOf()
//             let matchingId =data.filter(x=>x.product_id.includes(productId));
//             console.log("----matchingId>",matchingId)
//       })

//          console.log("<<<allProduct<<",allProduct)

//      // const delete_Category= await Category.findByIdAndDelete(req.params.id)
//      // const delete_product= await Products.deleteOne({"cat_id":req.params.id})
//      // const delete_product= await Products.updateMany({},{$pull:{cat_id:{$in:{id}}}})
//         console.log(">>>delete_Category>>>",delete_Category)
//         console.log(">>>delete_product>>>",delete_product)
     
//       //   if(!req.params.id){
//       //       return   res.status(400).send({message:"Pass Id"})
//       //   }
//         res.status(201).send(data)

//     }
//     catch(error){
//         res.status(301).send(error)
//     }
// })
