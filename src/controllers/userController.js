const UserModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const {isValidInputBody,isValidInputValue,isValidOnlyCharacters,isValidAddress,isValidEmail,isValidPhone,
    isValidPassword,isValidNumber,isValidPincode,isValidPrice,isValidObjectId,isValidImageType}= require("../utilities/validator");
const CartModel = require("../models/cartModel")

//user registertion

const userRegistration = async function(req, res) {
    try {
        const requestBody = req.body  ;
        const queryParams = req.query;
       

        //no data is required from query params
        if (isValidInputBody(queryParams)) {
            return res
                .status(404)
                .send({ status: false, message: "Page not found" });
        }

        if (!isValidInputBody(requestBody)) {
            return res
                .status(400)
                .send({status: false,message: "User data is required for registration"});
        }

        //using destructuring
        let { name,email, phone ,role} = requestBody;

        // each key validation starts here
        if (!isValidInputValue(name) || !isValidOnlyCharacters(name)) {
            return res
                .status(400)
                .send({status: false,message: "name is required and it should contain only alphabets"});
        }

        if (!isValidInputValue(email) || !isValidEmail(email)) {
            return res
                .status(400)
                .send({ status: false, message: "email address is required and should be a valid email address" });
        }

        if (!isValidInputValue(phone) || !isValidPhone(phone)) {
            return res
                .status(400)
                .send({ status: false, message: "Phone number is required and should be a valid mobile number" });
        }


        if (!isValidInputValue(role) || !isValidOnlyCharacters(role)) {
            return res
                .status(400)
                .send({status: false,message: "Role is required and it should contain Admin or User"});
        }
        // email should be unique
        const notUniqueEmail = await UserModel.findOne({ email });

        if (notUniqueEmail) {
            return res
                .status(400)
                .send({ status: false, message: "Email address already exist" });
        }

       
        const notUniquePhone = await UserModel.findOne({ phone });

        if (notUniquePhone) {
            return res
                .status(400)
                .send({ status: false, message: "phone number already exist" });
        }

        const userData = {
            name: name,
            email: email,
            phone: phone.trim(),
            role:role
          
        };
        
        // registering a new user
        const newUser = await UserModel.create(userData);

        // after creating user creating an empty cart for same user
        const newUserCart = await CartModel.create({
            userId: newUser._id,
            items: [],
            totalItems: 0,
            totalPrice: 0
        })

        res
            .status(201)
            .send({status: true,message: "User successfully registered",data: newUser});

    } catch (error) {

        res
            .status(500)
            .send({ error: error.message });

    }
};

//**********************************************USER LOGIN*************************************************** */

const userLogin = async function (req, res) {
    try {
      
      let requestBody=req.body;
      const UserName = requestBody.name;
      const UserEmail = requestBody.email;
     

      if (!isValidInputBody(requestBody)) {
        return res
            .status(400)
            .send({status: false,message: "User data is required for login"});  
    }
    if (!isValidInputValue(UserName) || !isValidOnlyCharacters(UserName)) {
        return res
            .status(400)
            .send({status: false,message: "name is required and it should contain only alphabets"});
    }

    if (!isValidInputValue(UserEmail) || !isValidEmail(UserEmail)) {
        return res
            .status(400)
            .send({ status: false, message: "email is required and should be a valid email" });
    }
   
      let Author = await UserModel.findOne({
        
        email: UserEmail,
        
      });
  
      //console.log("author-role",Author.role, "author-id",Author._id,"author-email",Author.email)
      if (!Author) {
        return res.status(400).json({ error: "not found" });
      }
  
      let token = jwt.sign(
        {
          id: Author._id,email:UserEmail,
          role:Author.role

        },
        "Project-2"
      );
      res.status(201).send({ status: true, data: token });
    } catch (err) {
      res.status(500).send({ message: "Error", error: err.message });
    }
  };


module.exports = {
    userRegistration,
     userLogin,
    // profileDetails,
    // userProfileUpdate
};
