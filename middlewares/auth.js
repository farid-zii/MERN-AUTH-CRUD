const express  = require('express')

const jwt = require('jsonwebtoken')

const verifyToken = (req,res,next) =>{
    const token = req.headers['authorization']
    if(!token) return res.status(401).json({msg:"Unauthorization"})

        jwt.verify(token, process.env.JWT_SECRET,(err,decoded)=>{
            //jika ada error kembalikan status 401 dengan pesan invalid token 
            if(err) return res.status(401).json({msg:"invalid token"});
            req.userId = decoded.id
            next();
        })
}

module.exports = verifyToken;