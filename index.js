const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();
const port = 4000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const mongoURI = process.env.MONGO_URI;

mongoose
    .connect(mongoURI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("Error connecting to MongodB", err));

const userSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String
});

const User = mongoose.model('user',userSchema);

app.get('/users',(req,res) => {
    User.find({})
        .then(users => res.json(users))
        .catch(err => res.status(500).json({message:err.message}));
});


app.post('/users',(req,res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    user.save()
        .then(newUser => res.status(201).json(newUser))
        .catch(err => res.status(400).json({message: err.message}));
});

app.put('/users/:id',(req,res) => {
    const userID = req.params.id;
    const updateData = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    };

    User.findByIdAndUpdate(userID,updateData,{new : true})
        .then(updatedUser => {
            if(!updatedUser) {
                return res.status(404).json({message: 'User not found'});
            }
            res.json(updatedUser);
        })
        .catch(err => res.status(400).json({message: err.message}));
});


app.delete("/users/:id", (req,res)=>{
    const userID = req.params.id;

    User.findByIdAndDelete(userID)
        .then(deleteUser => {
            if(!deleteUser) {
                return req.status(404).json({message: 'User not found'});
            }
            res.json({message: 'User deleted successfully'});
        })
        .catch(err => res.status(400).json({message: err.message}));
});


app.listen(port, ()=>console.log('Server is live'));