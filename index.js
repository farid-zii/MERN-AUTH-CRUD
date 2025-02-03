const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
//import router
const router = require('./routes')
// init app
const app = express()

//use cors
app.use(cors())



app.use(bodyParser.urlencoded({extended:false}))



//define port
const port = 3000;

app.get('/',(req,res)=>{
    res.send("Hello Tester")
});

app.use('/api',router)

//start server
app.listen(port,()=>{
    console.log(`Server running on port ${port}`)
})