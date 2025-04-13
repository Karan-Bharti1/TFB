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
    app.post("/projects/auth",verifyJWT,async(req,res)=>{
        const data =req.body
        try {
         const project=new Project(data)   
         const savedProject=await project.save()
         if(savedProject){
            res.status(200).json({message:"Project updated successfully",project:savedProject})
         }
        } catch (error) {
            console.log(error)
        res.status(500).json({message:"failed to add project"})  
        }
    })
    
    app.get("/projects/auth",async(req,res)=>{
        try {
           const projects=await Project.find() 
           if(projects){
            res.status(200).json(projects)
        }else{
            res.status(400).json({message:"No Projects found"})   
        }
        } catch (error) {
            res.status(500).json({message:"Failed to fetch Projects data"}) 
        }
    })
    app.post("/teams/auth",verifyJWT,async(req,res)=>{
        const data =req.body
        try {
         const newTeam=new Team(data)   
         const savedTeam=await newTeam.save()
         if(savedTeam){
            res.status(200).json({message:"Team updated successfully",team:savedTeam})
         }
        } catch (error) {
            console.log(error)
        res.status(500).json({message:"failed to add team data"})  
        }
    })
    app.get("/teams/auth",async(req,res)=>{
        try {
           const teams=await Team.find() 
           if(teams){
            res.status(200).json(teams)
        }else{
            res.status(400).json({message:"No Teams found"})   
        }
        } catch (error) {
            res.status(500).json({message:"Failed to fetch Teams data"}) 
        }
    })
    app.get("/tasks/projects/auth/:id",verifyJWT,async(req,res)=>{
        const projects=await Task.find({project:req.params.id})
       try {
        if(projects){
            res.status(200).json(projects)
        }else{
            res.status(404).json({message: "Projects not found"})
        }
       } catch (error) {
        res.status(500).json({message:"Failed to fetch projects data"})
       }
    })
    app.get("/tasks/auth",verifyJWT,async(req,res)=>{
        try {
            const filter = {};
    
            if (req.query.team) filter.team = req.query.team;
    
            if (req.query.owner) {
    
                const ownerIds = req.query.owner.split(",");
                filter.owners = { $in: ownerIds };
            }
    
            if (req.query.tags) {
            
                filter.tags = { $in: req.query.tags.split(",") };
            }
    
            if (req.query.project) filter.project = req.query.project;
            if (req.query.status) filter.status = req.query.status;
    
            const tasks = await Task.find(filter).populate("team owners");
            res.status(200).json(tasks);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Failed to fetch tasks", error });
        }
    })
    app.delete("/tasks/auth/:id",verifyJWT,async(req,res)=>{
 
        try {
            const deletedData=await Task.findByIdAndDelete(req.params.id) 
            if(deletedData){
                res.status(200).json({message:"Task deleted successfully",deletedData})
            }else{
    res.status(400).json({message:"Task does not exists"})
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Failed to delete tasks", error });
            console.log()
        }
    })
    app.post("/tasks/auth",verifyJWT,async(req,res)=>{
        try {
            const task = new Task(req.body);
            const savedTask = await task.save();
            res.status(200).json({ message: "Task created successfully", task: savedTask });
        } catch (error) {
            
            res.status(500).json({ message: "Failed to create task", error });
        }
    })
    app.put("/tasks/auth/:id",verifyJWT,async(req,res)=>{
        try {
            const updatedData=await Task.findByIdAndUpdate(req.params.id,req.body,{new:true})
            if(updatedData){
                res.status(200).json({message:"Data Updated Successfully",task:updatedData})
            }else{
                res.status(400).json({message:"Task not found"})
            }
        } catch (error) {
            res.status(500).json({message:"Failed to update task data"})
        }
    })
    app.get("/report/lastweek",verifyJWT,async(req,res)=>{
        const  currentDate=new Date()
        currentDate.setHours(23,59,59,999)
        const lastDate=new Date()
        lastDate.setDate(currentDate.getDate()-7)
        lastDate.setHours(0,0,0,0)
        try {
           const tasks =await Task.find({
            status:"Completed",
            updatedAt:{ $gte :lastDate,$lte: currentDate}
           }) 
           if(tasks.length>0){
            res.status(200).json(tasks)
           }else{
            return res.status(404).json({ error: "No tasks completed in the last 7 days." });
           }
        } catch (error) {
            return  res.status(500).json({ error: "Failed to fetch completed tasks in last 7 days." });
        }
    })
app.listen(PORT,()=>{
    console.log( `App is running at ${PORT}`)
  })
  