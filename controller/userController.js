const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const prisma = require('../prisma/client');
const fs = require('fs');
const path = require('path');


const findUsers= async(req,res)=>{
    try{
        const users = await prisma.user.findMany({
            select:{
                id:true,
                name:true,
                email:true,
                image:true,
            },
            orderBy:{
                id:"desc"
            }
        })

        res.status(200).send({
            success:true,
            msg:"Get all users successfully",
            data:users
        })
    }catch(err){
        res.status(500).send({
            success:false,
            msg:"internal server error"
        })
    }
}

const create = async(req,res) =>{
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
            msg: 'User created success',
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
}

const findUserById= async(req,res)=>{
    const {id} = req.params

    try{
        const user = await prisma.user.findUnique({
            where:{
                id:Number(id)
            },
            select:{
                email:true,
                name:true,
                image:true,
            }
        })

        res.status(200).send({
            success:true,
            msg:`Success get data by ${id}`,
            data:user
        })
    }catch(error){
        res.status(500).send({
            success:false,
            msg:"Internal Server Error"
        })
    }
}

const updateUser = async(req,res)=>{
    const errors = validationResult()
    if(!errors.isEmpty())return res.status(422).send({
        success:false,
        msg:"Validation Error",
        data:errors.array()
    })

    const {id} = req.params

    try{
        const user = await prisma.user.findUnique({
            where:{
                id:Number(id)
            }
        })

        if (!user) {
            return res.status(404).send({
                success: false,
                msg: "User not found",
            });
        }

        let imagePath = user.image
        if(req.file){
            //Hapus gambar lama jika ada
            if(user.image){
                const oldImagePath = path.join(__dirname,"../",user.image)
                if(fs.existsSync(oldImagePath)){
                    fs.unlinkSync(oldImagePath)
                }
            }
            imagePath ="uploads/"+req.file.filename
        }

        let newPassowrd = user.password;
        if(req.body.password){
            newPassowrd = await bcrypt.hash(req.body.password,10)
        }

        const updateUser = await prisma.user.update({
            where:{
                id:Number(id)
            },
            data:{
                name:req.body.name,
                email:req.body.email,
                password:newPassowrd,
                image:imagePath
            }
        })

        res.status(200).send({
            success:true,
            msg:`Update user Success`,
            data:updateUser
        })
    }catch(error){
        res.status(500).send({
            success:false,
            msg:"Internal Server Error"
        })
    }
}

const deleteUser = async()=>{
    const {id}= req.params

    if(!id){
        res.status(404).send({
            success:false,
            msg:"Data Not Found"
        })
    }

    try{
        const user = await prisma.user.findUnique({
            where:{
                id:Number(id)
            }
        });

        if(!user){
            res.status(404).send({
                success:false,
                msg:"Data Not Found"
            })
        }

        // Hapus gambar jika ada
        if (existingUser.image) {
            const imagePath = path.join(__dirname, "../", existingUser.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        // Hapus user dari database
        await prisma.user.delete({
            where: { id: Number(id) },
        });

        res.status(200).send({
            success: true,
            msg: "User deleted successfully",
        });
    }catch(err){
        res.status(500).send({
            success: false,
            msg: "Internal Server Error",
            error: err.message,
        });
    }
    
    
}

module.exports = {findUsers,create,findUserById,updateUser,deleteUser}