const {initialiseDatabase}=require('./database/database.connection')
initialiseDatabase()
const express=require('express')
const app=express()
const cors=require("cors")
const PORT=3000
const jwt=require('jsonwebtoken')
app.use(express.json())
const corsOptions = {
    origin: true, 
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    allowedHeaders: ["Content-Type", "authorization", "X-Requested-With"],
    optionsSuccessStatus: 200  
}
app.use(cors(corsOptions))
const JWT_SECRET="your_jwt_secret"
const User=require("./models/Owner.models")
const Tags=require("./models/Tag.models")
const Project=require("./models/Project.models")
const Team=require("./models/Teams.models")
const Task=require('./models/Tasks.models')
const verifyJWT=(req,res,next)=>{
    const token=req.headers['authorization']
    if(!token){
        res.status(401).json({message:"No token was found"})
    }
    try {
        const decodedToken=jwt.verify(token,JWT_SECRET)
        req.user=decodedToken
        next()
    } catch (error) {
       res.status(402).json({message:"Invalid Token"}) 
    }
}

const ownerSignUp = async (data) => {
    try {
       
        const newUser=new User(data)
        const savedData = await newUser.save();
        return savedData;
    } catch (error) {
        throw error;
    }
};
app.post("/signup",async(req,res)=>{
try {
    const data=await ownerSignUp(req.body)
    if(data){
        res.status(200).json({message:"Account Created Successfully",data})
    }
} catch (error) {
    res.status(500).json({message:"Failed To add user to database"})
}
})
app.get("/users",async(req,res)=>{
  
    try {
        const existingUsers = await User.find();
       if(existingUsers){
        const emailIds=existingUsers.map(user=>user.email)
        res.status(200).json({emailIds })}
       else{
        res.status(404).json({message:"Users not found"})
       }
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
})
app.post("/login",async(req,res)=>{
    const user=req.body
    const userDB=await User.findOne(user)
    if(userDB.email===user.email && userDB.password===user.password){
        const token=jwt.sign({role:"admin"},JWT_SECRET,{expiresIn:"24h"})
        res.status(200).json({token})
    }else{
        res.json({message:"Invalid Secret"})
    }
})
app.get("/get/auth/me",verifyJWT,async(req,res)=>{
    const {email}=req.body;
    try {
        const userData=await User.findOne({email:email})
        if(userData){
            res.status(200).json({message:"User Details Fetched Successfully",userData})
        }else{
            res.status(400).json({message:"No User Found"})
        }
    } catch (error) {
      res.status(500).json({message:"Failed to fetch user data"})  
    }
    })
    app.post("/tags/auth",verifyJWT,async(req,res)=>{
    
        try {
            const newTag= new Tags(req.body)
            const saveTag=await newTag.save()
            if(saveTag){
                res.status(200).json({message:"Tag updated successfully",tag:saveTag})
            }
        } catch (error) {
           res.status(500).json({message:"Failed to create new tag"}) 
           console.log(error)
        }
    })
    app.get("/tags/auth",verifyJWT,async(req,res)=>{
        
        try {
            const tagdData= await Tags.find()
            if(tagdData && tagdData.length>0){
                res.status(200).json(tagdData)
            }else{
                res.status(400).json({message:"No tags found"})   
            }
        } catch (error) {
           res.status(500).json({message:"Failed to fetch tags data"}) 
        }
    })
app.listen(PORT,()=>{
    console.log( `App is running at ${PORT}`)
  })
  