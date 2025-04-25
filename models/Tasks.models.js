

const mongoose=require('mongoose')
const taskSchema = new mongoose.Schema({
    name: { type: String, required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'ProjectTasks', required: true }, 
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'TeamTasks',
   required: true }, // Refers to Team model
    owners: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Refers to User model (owners)
    ],
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref:"TagsTak"}], // Array of tags
    timeToComplete: { type: Number, required: true }, // Number of days to complete the task
    status: {
    type: String,
    enum: ['To Do', 'In Progress', 'Completed', 'Blocked'],
   // Enum for task status
    default: 'To Do'
    }, // Task status
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }});
    // Automatically update the `updatedAt` field whenever the document is updated
    taskSchema.pre('save', function (next) {
     this.updatedAt = Date.now();
     next();
    });
    module.exports = mongoose.model('Task', taskSchema);