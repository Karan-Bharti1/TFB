# TFB


Task Management is a task management and team collaboration tool where users can create projects, assign tasks to teams and owners, set deadlines, and organize work using tags. It supports authentication, dynamic filtering, URL-based queries, and reporting features to track task progress and team productivity.

[For Frontend Code Refer](https://github.com/Karan-Bharti1/Task-Finder?tab=readme-ov-file)

## Author

- [@Karan-Bharti1](https://github.com/Karan-Bharti1)

  ## 🚀 About Me
Hi there! 👋.
I am currently learning Full Stack Web Development with a focus on the MERN stack (MongoDB, Express.js, React, and Node.js). I'm passionate about building dynamic, user-friendly web applications and continuously improving my skills.

## Tech Stack

**Frontend:** React, React Router for URL-based filtering, Axios for API calls, Chart.js for visualizations,Redux-Toolkit for state management.

**Backend:** Express.js with RESTful APIs, Mongoose for database interactions with MongoDB.

**Database:** MongoDB with models for leads, sales agents, comments, and tags.

## Key Features

- Added api to sign up any individual
- Added api to get all registered users email id's
- Added api to login any user
- Creating jwt tokens and verification
- Added Protected api to get all users data
- Added Protected api to add new tag data
- Added Protected api to get all tags data
- Added Protected api to post project data
- Added Protected api to post team data
- Added Protected api to get all projects data
- Added Protected api to get all teams data
- Added Protected api to post Tasks data
- Added Protected api to get all tasks data
- Added Protected api to delete tasks data
- Added Protected api to update tasks data
- Added Protected api to get all tasks closed last week
- Added api to get all tasks data for a team using team id
- Added api to get all tasks data for a project using project id


## Mongoose Models

###Owner

```javascript
const mongoose = require('mongoose');
// User Schema
const userSchema = new mongoose.Schema({
 name: { type: String, required: true }, // User's name
 email: { type: String, required: true, unique: true }, // Email must be unique
 password:{type:String,required:true}
});
module.exports = mongoose.model('User', userSchema);
```

### Project

```javascript
const mongoose = require('mongoose');
// Project Schema
const projectSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // Project names must be unique
    description: { type: String }, // Optional field for project details
    createdAt: { type: Date, default: Date.now }
   });
   module.exports = mongoose.model('ProjectTasks', projectSchema);
   ```

### Tags 

```javascript
const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true } // Tag names must be unique
   });
   module.exports = mongoose.model('TagsTak', tagSchema);
```

###Tasks
```javascript
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
```

### Teams

```javascript
const mongoose = require('mongoose');
// Team Schema
const teamSchema = new mongoose.Schema({
 name: { type: String, required: true, unique: true }, // Team names must be unique
 description: { type: String } // Optional description forthe team
});
module.exports = mongoose.model('TeamTasks', teamSchema);
```
