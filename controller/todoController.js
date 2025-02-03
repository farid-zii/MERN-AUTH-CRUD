// const express = require('express')
// const {validateTodo} = require('../utils/validators/todo')
const { validationResult } = require('express-validator');
const prisma = require('../prisma/client');
const { use } = require('../routes');

const getTodos = async(req,res)=>{
    const id = req.params.id
    if(!id) return res.status(404).send({
        success:false,
        msg:"Todos Not Found",
    })

    if(!req.userId) return res.status(401).send({
        success:false,
        msg:"Please Login",
    })
    try {
        const todos = await prisma.todo.findMany({
            where: {
                userId: Number(req.userId), // Use the userId from request
            },
            select: {
                id: true,
                title: true,
                description: true,
                completed: true,
                createdAt: true,
                user: { // Include related user data
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });
    
        res.status(200).send({
            success:true,
            msg:"List Todos",
            data:todos,
            // user:user
        })
    } catch (error) {
        res.status(500).send({
            success:false,
            msg:"Internal Server Error",
        })
    }
}

const createTodos = async(req,res)=>{
    const error = validationResult(req)

    if(!error.isEmpty()) return res.status(400).send({
        success:false,
        msg:"Validation Error",
        data:error.array()
    })

    if(!req.userId) return res.status(401).send({
        success:false,
        msg:"Please Login",
    })

    try {
        const todos = await prisma.todo.create({
            data:{
                title:req.body.title,
                description:req.body.description,
                userId:req.userId,
            }
        })

        return res.status(200).send({
            success:true,
            msg:"Success Created Todo",
            data:todos
        })
    } catch (error) {
        return res.status(500).send({
            success:success,
            msg:"Internal Server Error",
            // data:todos
        })
    }
}

const findTodoById = async()=>{
    const id = req.params.id
    if(!id) return res.status(404).send({
        success:false,
        msg:"Todos Not Found",
    })

    if(!req.userId) return res.status(401).send({
        success:false,
        msg:"Please Login",
    })

    try {
        const todo = await prisma.todo.findUnique({
            where:{
                id:Number(id),
                userId:req.userId
            },
            select: {
                id: true,
                title: true,
                description: true,
                completed: true,
                createdAt: true,
                user: { 
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        })

        res.status(200).send({
            success:true,
            msg:"Detail todo",
            data:todo
        })
    } catch (error) {
        
        res.status(500).send({
            success:false,
            msg:"Internal Server Error",
            // data:todo
        })
    }   
}

const updateTodo = async(req,res)=>{
    const {id} = req.params 

    try {
        const todo = await prisma.todo.findUnique({
            where:{
                id:Number(id)
            },
            select:{
                title:true,
                description:true,
            }
        })

        if(!todo) return res.status(404).send({
            success:false,
            msg:"Todo Not Found"
        })

        const update = await prisma.todo.update({
            where:{
                id:Number(id)
            },
            data:{
                title:req.body.title,
                description:req.body.description,
                completed:req.body.completed,
                // updateAt:Date,
            }
        })

        res.status(201).send({
            success:true,
            msg:"Update Todo Success",
            data:update
        });
        
        
    } catch (error) {
        
        res.status(500).send({
            success:false,
            msg:"Internal server Error"
        });
    }
}

const destroy = async(req,res)=>{
    const {id} = req.params

    try {
        await prisma.todo.delete({
            where:{id:Number(id)}
        })

        res.status(200).send({
            success:true,
            msg:"Delete Todo Success",
        })
    } catch (error) {
        res.status(500).send({
            success:false,
            msg:"Internal Server Error",
        })
        
    }
}




module.exports = { getTodos,createTodos,findTodoById,updateTodo,destroy}