const express = require("express");
const router = express.Router();

const jwt = require('jsonwebtoken');

const mongoClient = require('mongodb').MongoClient;  

const dotenv = require("dotenv");
dotenv.config();

// import the user schema
const User = require("../model/user");

// get all user
router.get('/userslist', function(req, res) {    
   try{
        User.find({}, function (err, users) {
            res.send(users);
        });
   }
   catch(err){
       res.status(500).send(err);
   }
});

// search by name - only access with manager 
router.get("/searchbyname",tokenVerify, async (req, res)=>{
    try{
        const checkManager = await User.findOne({email:req.token});
        if(checkManager.role !== "manager"){
            res.status(401).send("only access with manager");
            return;
        }
        if(!req.query){
            res.status(500).send("name is missing");
            return;
        }
        else
        {
            const search = req.query.name;
            User.find({name:{$regex :search, $options: '$i' }})
                .then(data =>{
                    res.send(data);
            });
        }
    }
    catch(err){
        res.status(500).send(err);
    }
});

// middleware
function tokenVerify (req, res, next) {
    try{
          // Get auth header value
         const bearerHeader = req.headers['authorization'];
         if(typeof bearerHeader === 'undefined'){
            res.status(500).send("enter your token");
            return;
         }
         // Check if bearer is undefined
         if(typeof bearerHeader !== 'undefined') {
             // Split at the space
             const bearer = bearerHeader.split(' ');
             // Get token from array
             const bearerToken = bearer[1];
             // Set the token
             req.token = bearerToken;
             // token validator
             const data = jwt.verify(req.token,process.env.KEY);
             if(data){
                 //console.log(data.data);
                 req.token = data.data;
                 next();
                 return;
             }
         else{
             res.status(500).send("enter your Token")
             return;
         }
     }
     else{
         res.status(500).send("Token Invalid")
         return;
     }
    }
    catch(err){
        res.status(500).send(err);
    }
 };
 
 router.get("/sort",(req,res)=>{
    try{
        // Database name
        const databasename = "users_management_system";
    
        // Connecting to MongoDB
        mongoClient.connect(process.env.URI).then((db) => {
            const connect = db.db(databasename);
    
            // Connecting to collection
            const collection = connect.collection("users");
            //console.log("Connection Created")
    
            // Sort the document key
            const sort = { name: 1 };
    
            collection.find().sort(sort).toArray((err, ans,) => {
                if (!err) {
                    res.send(ans);
                    return;
                }
                else{
                    res.status(500).send("error occured in sorting")
                    return;
                }
            });
    
        }).catch((err) => {
            console.log(err.Message);
            res.status(500).send(err);
        })
    }
    catch(err){
        res.status(500).send(err);
    }
 });
 
// Adding Pagination
router.get("/pagination",async (req, res)=>{
    try {
        const limitValue = parseInt( req.query.limit) ;
        const skipValue = parseInt(req.query.skip) ;
        const posts = await User.find()
            .limit(limitValue).skip(skipValue);
        res.status(200).send(posts);
    } catch (e) {
        res.status(500).send("enter valid limit,skip values ");
    }
});

module.exports = router;