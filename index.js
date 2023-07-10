const express = require('express')
const router = require('./routes')
const app = express()

app.use(express.json())

const port = process.env.PORT || 8080

app.get('/',(req, res, next)=>{
  res.send('Welcome to my project')
})

app.use('/',router)

app.listen(port, ()=>{
  console.log(`Listening to port ${port}`);
})