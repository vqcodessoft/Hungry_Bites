const express = require('express')
const app = express()
require("./database/databaseConn")
const AdminLogin = require("./models/adminLogin")
const Products = require("./models/product")
const Category = require("./models/category")
const MenuItem = require("./models/metuItem")
const port = 8000;

app.use(express.json())

app.get("/owner",(req,res)=>{
    res.send("Hello World")
})


///--------------------------   -POST Request API BOX --   ------------------------------//

//login
app.post("/login",async(req,res)=>{
   const {username,password} = req.body;
    if(!req.body.username ||!req.body.password ){
        res.status(301).json({message:"Please fill username/password" })
    }
    try{
       
        const data = await AdminLogin.findOne({username:username})
        console.log(">>>>.",data)
              if(data){
                    if(password===data.password){
                        res.status(201).send({
                            type:data.type, 
                            _id:data._id,
                            category_id:data.category_id?data.category_id:"",
                            message: "Login Successfully " })
                    }else{
                        res.send({ message: "password  didn't match" })
                    }

              }else{
                res.status(402).send({ message: "User not register " })
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
       const {name,username,password,type,Category_type,subscription,address,phone_no,cat_id,status} = req.body;
       
       if(!name ||!username|| !password ||!type){
        res.status(301).json({message:"Please fill username/password" })
       }
       try{
            const {admin_id} = req.body
            const {cat_id} = req.body
           const data = await new Products({name,Category_type,address,phone_no,cat_id,status})
                     const category = await Category.findById(cat_id)
                    
                           await category?.product_id?.push(data)
           console.log(">>>>",data)
              //const admin = await AdminLogin.findById(admin_id)
            //  await admin?.category?.push(data)
                   const product_id  = data._id
                 data.save((err)=>{
                     if(!err){
                         res.status(201).send({category:data})
                          const admin = new AdminLogin({name,username,password,type,product_id,subscription,status})
                          admin.save()
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

//Category
app.post("/category",async(req,res)=>{
           const {name,status}=req.body
           if(!name || !status){
            res.status(301).json({message:"Please fill name/status" })
           }
           try{
               const category= await new Category({name,status})
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
    const {product_name,description,price,product_id} = req.body

    try{
        const menuItem = await new MenuItem({product_name,description,price,product_id})
         const product = await Products.findById(product_id)
            await product?.menu_item?.push(menuItem)

            menuItem.save((err)=>{
                if(err){
                    res.status(400).send(err)
                }else{
                    res.status(200).send(menuItem)
                }
            })

           await product?.save()

    }catch(error){
        res.status(400).send(error)
    }
})

//--------------------------------------------------Get Request API BOX ------------------------------------->

//get category----
app.get("/find-category",async(req,res)=>{

    try{
        const findCategory = await Category.find({}).populate('product_id')
        console.log(">>findCategory>>",findCategory)
             res.status(201).send(findCategory)

    }catch(error){
        res.status(400).send(error)
    }
})

// get product-----
app.get("/find-products",async(req,res)=>{
    try{
        const findProduct = await Products.find({}).populate('menu_item')
        console.log(">>findProduct>>",findProduct)
        res.status(201).send(findProduct)

    }catch(error){
        res.status(400).send(error)
    }
})

//get Menu Items ------
  app.get("/find-menuItem",async(req,res)=>{
    try{
        const findMenuItem = await MenuItem.find({})
        console.log(">>findMenuItem>>",findMenuItem)
        res.status(201).send(findMenuItem)

    }catch(error){
        res.status(400).send(error)
    }
})




//----------------------------------------------------------------delete Request API Box--------------------->

//Delete product and category inside product Id
app.delete("/delete_products-category/:id",async(req,res)=>{
    try{

        const delete_product= await Products.findByIdAndDelete(req.params.id)
        const deleteAdmin= await AdminLogin.deleteOne({"product_id":req.params.id})
        const delete_category= await Category.updateMany({},{$pull:{product_id:{$in:[req.params.id]}}})
        console.log("deleteAdmin-->",deleteAdmin)
        console.log("delete_category-->",delete_category)
          if(!req.params.id){
              return   res.status(400).send({message:"Pass Id"})
          }
          res.status(201).send(delete_product)

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

app.listen(port,()=>{
    console.log(`server is listen on: https://localhost:${port}`)
})