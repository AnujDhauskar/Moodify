const mongoose = require("mongoose")


async function connectToDb(){
    await mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("Server connected to db")
    })
    .catch((err)=>{
        console.log("Error happed while connecting to database")
    })
}

module.exports = connectToDb;

