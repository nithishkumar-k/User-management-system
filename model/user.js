// create a user schema
const mongoose = require("mongoose");
const schema = mongoose.Schema;

const userSchema = new schema({
    name:{
        type: String,
        require: true,
    },
    email:{
        type: String,
        require: true,
    },
    password:{
        type: String,
        require: true,
    },
    role:{
        type: String,
        require: true,     
    },

});

// export the module
const User = mongoose.model("User",userSchema);
module.exports = User;