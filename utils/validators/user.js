const {body} = require('body-parser')

const prisma = require('prisma')

const validateUser = [
    body('name').notEmpty().withMessage('Name is Required'),
    body('image').notEmpty().withMessage('Image is required')
            .bail()
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
        .notEmpty().withMessage('Email is Required')
        .isEmail().withMessage('Email is Invalid')
        .custom(async(value,{req})=>{
            if(!value){
                throw new Error('Email is Required')
            }

            const user= await prisma.user.findUnique({where:{email:value}});
            if(user&user.id !== Number(req.params.id)){
                throw new Error('Email already exist')
            }

            return true
        }),
    body('password').notEmpty().withMessage('Password is Required')
        .isLength({min:6}).withMessage('Password must be at least 6 characters long')
];

module.exports = {validateUser}