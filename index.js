const {initialiseDatabase}=require('./database/database.connection')
initialiseDatabase()
const express=require('express')
const app=express()
const cors=require("cors")
const PORT=3000
app.use(express.json())
const corsOptions = {
    origin: true, 
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    optionsSuccessStatus: 200  
}
app.use(cors(corsOptions))
const JWT_SECRET="your_jwt_secret"
const User=require("./models/Owner.models")
const Tags=require("./models/Tag.models")
const Project=require("./models/Project.models")
const Team=require("./models/Teams.models")
const Task=require('./models/Tasks.models')
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
app.listen(PORT,()=>{
    console.log( `App is running at ${PORT}`)
  })
  