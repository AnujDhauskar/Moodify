const blacklistModel = require("../models/blacklist.model")
const userModel = require("../models/user.model")

const jwt = require("jsonwebtoken")


async function authUser(req,res,next){
    const token = req.cookie.token

    if(!token){
        return res.status(401).json({
            message:"Unauthorized accsses"
        })
    }

    const istokenBlacklisted = await blacklistModel.findOne({
        token
    })

    if(istokenBlacklisted){
        return res.status(401).json({
            message:"Token Invalid"
        })
    }

    try{
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        )

        req.user = decoded;
        next()
    }
    catch(err){
            return res.status(401).json({
                message:"Invalid Token"
            })
    }
}



module.exports = {authUser}