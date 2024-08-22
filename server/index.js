const express =require("express")
const mongoose=require("mongoose")
const cors =require("cors")
const app=express()
const RegisterModel=require('./models/Registermodel')

app.use(express.json())
app.use(cors())

mongoose.connect("mongodb://localhost:27017/MERN_LOGIN_REGISTER")


app.post('/login',(req,res)=>{
    const {email,password}=req.body;
    RegisterModel.findOne({email:email})
    .then(user =>{
        if(user){
            if(user.password == password){
                res.json("success")
            }
            else{
                res.json("incorrect password")
            }
        }
        else{
            res.json("user not found")
        }
    })
})

app.post('/register', (req,res)=>{
    RegisterModel.create(req.body).then(
        registers=>res.json(registers)
    ).catch(err=>res.json(err))
})

app.listen(3001,()=>{
    console.log("kishore's backend is running" );
})