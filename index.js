const express = require('express')

const app = express()

app.use(express.json())

const port = process.env.PORT || 8080

app.get('/',(req, res, next)=>{
  res.send('Welcome to my project')
})

app.listen(port, ()=>{
  console.log(`Listening to port ${port}`);
})