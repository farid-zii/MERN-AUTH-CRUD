const express = require('express');

// init app
const app = express()

//define port
const port = 3000;

app.get('/',(req,res)=>{
    res.send("Hello Fanda")
});

//start server
app.listen(port,()=>{
    console.log(`Server running on port ${port}`)
})