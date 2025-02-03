const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const prisma = require('../prisma/client');
const fs = require('fs');
const path = require('path');

//import jsonwebtoken
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            msg: 'Validation Error',
            errors: errors.array(),
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        let imagePath = null;
        if (req.file) {
            imagePath = "uploads/"+req.file.filename; // Simpan nama file
        }

        const user = await prisma.user.create({
            data: {
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
                image: imagePath, // Simpan path gambar di database
            },
        });

        res.status(201).send({
            success: true,
            msg: 'Register success',
            data: user,
        });
    } catch (err) {
        if (req.file) {
            fs.unlinkSync(path.join(__dirname, '../uploads', req.file.filename)); // Hapus file jika error terjadi
        }
        res.status(500).send({
            success: false,
            msg: 'Internal Server Error',
            error: err.message,
        });
    }
};

const login = async(req,res)=>{
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        return res.status(422).json({
            success:false,
            msg:"Validation Error",
            errors:errors.array
        })
    }

    try{
        const user = await prisma.user.findFirst({
            where:{
                email:req.body.email
            },
            select:{
                id:true,
                name:true,
                email:true,
                password:true,
                image:true
            }
        });

        if(!user)
            return res.status(404).json({
                success:true,
                msg:"User Not Found"
            })

        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        )

        if(!validPassword)return res.status(401).json({
            success:false,
            msg:"Invalid password"
        });

        //generate Token JWT
        const token = jwt.sign({id:user.id},process.env.JWT_SECRET,{
            expiresIn:"1h"
        })

        const {password,...userWithoutPassword } = user

        //response 
        res.status(200).send({
            success:true,
            msg:"Login success",
            data:{
                user:userWithoutPassword,
                token:token,
            }
        })
    }catch(err){
        res.status(500).send({
            success: false,
            message: "Internal server error",
        });
    }
}

module.exports = { register,login };
