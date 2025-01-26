const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// init app
const app = express()

//use cors
app.use(cors())

app.use(bodyParser.urlencoded({extended:false}))

//parse application/json
app.use(bodyParser.json())

//define port
const port = 3000;

app.get('/',(req,res)=>{
    res.send("Hello Fanda")
});

//start server
app.listen(port,()=>{
    console.log(`Server running on port ${port}`)
})