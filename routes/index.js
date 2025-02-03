const express = require('express');

const router = express.Router()


const authController = require('../controller/authController');
const userController = require('../controller/userController');
const todoController = require('../controller/todoController');

const {validateRegister, validateLogin} = require('../utils/validators/auth')

const upload = require("../middlewares/multer")

//import verifyToken
const verifyToken = require('../middlewares/auth');
const { validateTodo } = require('../utils/validators/todo');




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
router.put('/admin/user/:id',verifyToken,upload.single('image'),userController.updateUser);
router.delete('/admin/user/:id',verifyToken,userController.deleteUser);


//GET TODO
router.get('/admin/todo',verifyToken,todoController.getTodos);
//POST TODO
router.post('/admin/todo',verifyToken,validateTodo,todoController.createTodos);
router.get('/admin/todo/:id',verifyToken,todoController.findTodoById);
router.put('/admin/todo/:id',verifyToken,validateTodo,todoController.updateTodo);
router.delete('/admin/todo/:id',verifyToken,validateTodo,todoController.destroy);


//export router
module.exports = router