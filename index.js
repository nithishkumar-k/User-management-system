const express = require("express");
const app = express();

app.use(express.json());

const routersUser = require("./router/rout_user");
const routersModify = require("./router/crud");
const routerList = require("./router/list");

const dotenv = require("dotenv");
dotenv.config();

//connecting database
const mongoose = require("mongoose");
mongoose.connect(process.env.URI,()=>{
    console.log("DB connected");
});

// routing
app.use("/api",routersUser);
app.use("/api/modify",routersModify);
app.use("/api",routerList);

app.use("*", (req, res)=>{
    res.status(404).json({
        code: "404",
        Message: "Page not found"
    })
});

app.listen(5000,()=>{
    console.log("server running on port 5000");
});