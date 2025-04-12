const mongoose=require("mongoose")
require("dotenv").config()
const mongooseUri=process.env.MONGODB
async function initialiseDatabase() {
    await mongoose.connect(mongooseUri)
    .then(()=>console.log("Connected to the Database"))
    .catch(error=>console.log("Error while connecting to the database",error))
}
module.exports={initialiseDatabase}