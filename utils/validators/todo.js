const {body} = require('express-validator')

const prisma = require('../../prisma/client')

const validateTodo =[
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    // body('userId').notEmpty().withMessage('User is required'),
];

module.exports =  {validateTodo} 