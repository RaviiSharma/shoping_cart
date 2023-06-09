const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel')
const {isValidInputValue,isValidObjectId} = require('../utilities/validator')

const authentication = function (req, res, next) {
    try {
        let token = req.headers['x-api-key']

        if (!token) {
            return res.status(401).send({ status: false, message: "neccessary header token is missing" })
        }
        
        jwt.verify(token, "Project-2", (err, Decoded)=> {
            if(err){ return res.status(403).send("failed authentication")}
          
          // console.log("decoded token",Decoded)
           req.user=Decoded

        })
        next()
         
    }catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

// const authorization = async function(req, res, next) {
//     const userId = req.params.userId
//     const Decoded = req.user
//      console.log("decoded-token",Decoded)
//      console.log("user-id",userId)
//     if (!isValidObjectId(userId)) {
//         return res.status(400).send({ status: false, message: " enter a valid userId" })
//     }

//     const userByUserId = await UserModel.findById(userId)

//     if (!userByUserId) {
//         return res.status(404).send({ status: false, message: " user not found" })
//     }
    
//     if (userId !== Decoded.id) {
//         return res.status(403).send({ status: false, message: "unauthorized access" })
//     }
//     next()
// }

module.exports = { authentication}

module.exports.authentication = authentication


