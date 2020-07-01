const express= require('express');
const app= express();
const PORT= 3000 || process.env.PORT;

//DB
const connectDB = require('./config/db');
connectDB();



app.get('/',(req,res)=>
{
  res.send("Home Route");
})

app.listen(PORT,()=>
{
  console.log("Server Started on port %s",PORT);
})

