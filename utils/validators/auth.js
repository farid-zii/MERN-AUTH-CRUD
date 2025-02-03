const {body} = require('express-validator')

const prisma = require('../../prisma/client')

const validateRegister =[
    body('name').notEmpty().withMessage('Name is required'),
    body('image')
        .custom((value,{req})=>{
            if(!req.file)
            {
                throw new Error ('Image file is required')
            }

            // Periksa tipe file (hanya menerima JPEG, PNG, JPG)
            const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!allowedMimeTypes.includes(req.file.mimetype)) {
                throw new Error('Invalid image format. Only JPEG, PNG, and JPG are allowed');
            }

            // Periksa ukuran file (maks 5 MB)
            const maxSize = 5 * 1024 * 1024; // 5 MB
            if (req.file.size > maxSize) {
                throw new Error('Image size must not exceed 5 MB');
            }

            return true;
        })
        ,
    body('email')
        .custom(async (value)=>{
            //Jika tidak memiliki value kembalikan/lemparkan Error
            if(!value){
                throw new Error('Email is required')
            }

            const user = await prisma.user.findUnique({where:{email:value}})
            //Jika email sudah terdaftar kembalikan Error
            if(user){
                throw new Error('Email alerady exist')
            }
            return true;
        }),
    body('password').isLength({min:6}).withMessage('Password must be at least 6 characters long'),
];

const validateLogin = [
    body('email').notEmpty().withMessage('Email is required'),
    body('password').isLength({min:6}).withMessage('Password must be at'),
]

module.exports = { validateRegister,validateLogin}