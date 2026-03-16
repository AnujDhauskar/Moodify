const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const blacklistModel = require("../models/blacklist.model")


async function registerUser(req, res){
    const {username , email,password} = req.body

    const isalreadyregistered = await userModel.findOne({
        $or:[
            {email},
            {username}
        ]
    })

    if(isalreadyregistered){
        return res.status(401).json({
            message:"User already Exits with this email or username"
        })
    }

    const hash = await bcrypt.hash(password,10)

    const user = await userModel.create({
        username,
        email,
        password : hash
    })

    const token = jwt.sign({
        id: user._id,
        username:user.username 
    },process.env.JWT_SECRET,{
        expiresIn:"3d"
    })

    res.cookie("token" , token)

    return res.status(201).json({
        message:"User Registered succssefully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })

    
}

async function loginUser(req,res){
        const {username,email,password} = req.body;

        const user = await userModel.findOne({
            $or:[
                {email},
                {username}
            ]
        }).select("+password")

        if(!user){
            return res.status(400).json({
                message: "Invalid Credentials"
            })
        }

        const ispasswordValid = await bcrypt.compare(password,user.password)

        if(!ispasswordValid){
            return res.status(400).json({
                message:"Invalid Password"
            })
        }

        const token = jwt.sign({
            id:user._id,
            username:user.username
        },process.env.JWT_SECRET,
        {
            expiresIn:"3d"
        })

        res.cookie("token", token)

        return res.status(201).json({
            message:"User Logged in successfully",

            user:{
                id: user._id,
                username:user.username,
                email:user.email
            }
            
        })

}

async function getMe(req,res){
    const user = await userModel.findById(req.user.id)

    if(!user){
        return res.status(401).json({
            message:"User not Found"
        })
    }

    return res.status(200).json({
        message:"User Fetched succsessfully",
        user
    })
}

async function logoutUser(req,res){
            const token = req.cookie.token

            res.clearCookie("token")

            await blacklistModel.create({
                token
            })

            return res.status(200).json({
                message:"Logout successfully"
            })
}

module.exports = {
registerUser,
loginUser,
getMe,
logoutUser

}
