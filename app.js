const express = require('express')
const app = express()
require("./database/databaseConn")
const AdminLogin = require("./models/adminLogin")
const port = 8000;

app.use(express.json())

app.get("/owner",(req,res)=>{
    res.send("Hello World")
})

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
                        res.status(201).send({type:data.type, message: "Login Successfully " })
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


//Categories
app.post("/category",async(req,res)=>{
       const {name,password,admine} = req.body
       if(!name ||!username|| !password ){
        res.status(301).json({message:"Please fill username/password" })
       }
})


app.listen(port,()=>{
    console.log(`server is listen on: https://localhost:${port}`)
})