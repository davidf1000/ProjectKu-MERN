const express = require('express');
const app = express();
const PORT = 3000 || process.env.PORT;

//DB
const connectDB = require('./config/db');
connectDB();

app.get('/', (req, res) => {
  res.send('Home Route');
});

app.use('/api/users',require('./routes/api/users') );
app.use('/api/auth',require('./routes/api/auth') );
app.use('/api/post',require('./routes/api/post') );
app.use('/api/profile',require('./routes/api/profile') );

app.listen(PORT, () => {
  console.log('Server Started on port %s', PORT);
});
