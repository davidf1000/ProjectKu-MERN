const express = require('express');
const app = express();
const PORT =  process.env.PORT||5000;
const path= require('path');
//DB
const connectDB = require('./config/db');
connectDB();

//Middle Ware
app.use(express.json({extended:false}));

// app.get('/', (req, res) => {
//   res.send('Home Route');
// });

app.use('/api/users',require('./routes/api/users') );
app.use('/api/auth',require('./routes/api/auth') );
app.use('/api/post',require('./routes/api/post') );
app.use('/api/profile',require('./routes/api/profile') );

//serve statics assets in production
if(process.env.NODE_ENV=== 'production')
{
  // stat folder
  app.use(express.static('client/build'));

  app.get('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname,'client','build','index.html'));
  })
}

app.listen(PORT, () => {
  console.log('Server Started on port %s', PORT);
  
});
