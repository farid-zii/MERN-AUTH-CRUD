const express = require('express');

const router = express.Router()


const authController = require('../controller/authController');
const userController = require('../controller/userController');

const {validateRegister, validateLogin} = require('../utils/validators/auth')

const upload = require("../middlewares/multer")

//import verifyToken
const verifyToken = require('../middlewares/auth');




//r

router.get('/',function(req,res){
    console.log('Halo dek!!' + req.query.name)
    res.status(200).send({
        succes:true,
        data:`Halo dek!!${req.query.name}`
    })
})
//REGISTER
router.post('/register',upload.single('image'),validateRegister,authController.register);
//LOGIN
router.post('/login',validateLogin,authController.login);
//GET USER
router.get('/admin/user',verifyToken,userController.findUsers);
//POST USER
router.post('/admin/user',verifyToken,upload.single('image'),validateRegister,userController.create);
//GET FIND User BY ID
router.get('/admin/user/:id',verifyToken,userController.findUserById);

//export router
module.exports = router