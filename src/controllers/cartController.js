const CartModel = require("../models/cartModel");
const ProductModel = require("../models/productModel");
const {isValidInputBody,isValidInputValue,isValidOnlyCharacters,isValidAddress,isValidEmail,isValidPhone,
    isValidPassword,isValidNumber,isValidPincode,isValidPrice,isValidObjectId,isValidImageType} = require("../utilities/validator");

//*********************************************ADD PRODUCT TO CART***************************************************** */

const AddProductToCart = async function(req, res) {
    try {
        const requestBody = req.body;
        const queryParams = req.query;
        //const userId = req.params.userId;

        // query params must be empty
        if (isValidInputBody(queryParams)) {
            return res
                .status(404)
                .send({ status: false, message: "page not found" });
        }
       
      const user = req.user; //decoded token
      console.log("inside endpoint", user);
  
      if (user.role !== "User") {
        //const data = await userModel.findById(user.id);
        res.status(200).json({ message: "Sorry you are not User" });
      }else{
        // using destructuring
        const { productId } = requestBody;
        const userId=user.id

        // validating product id
        if (!isValidInputValue(productId) ||!isValidObjectId(productId)) {
            return res
                .status(400)
                .send({status: false,message: "Product ID is required and should be valid"});
        }
        // product details
        const productByProductId = await ProductModel.findOne({
            _id: productId,
            isDeleted: false
        });
        console.log("productId-",productByProductId)

        if (!productByProductId) {
            return res
                .status(404)
                .send({ status: false, message: `No product found by ${productId}` });
        }

        // users cart details
        const userCartDetails = await CartModel.findOne({ userId: userId });

        // if cart is empty then adding product to cart's items array
        if (userCartDetails.items.length === 0) {
            const productData = {
                productId: productId,
                userId:userId,
                quantity: 1,
            };

            const cartData = {
                items: [productData],
                totalPrice: productByProductId.price,
                totalItems: 1,
            };

            const newCart = await CartModel.findOneAndUpdate({ userId: userId }, { $set: cartData }, { new: true });

            return res
                .status(201)
                .send({status: true,message: "Product added to cart",data: newCart});
        }

        // checking whether product exist in cart or not
        const isProductExistsInCart = userCartDetails.items.filter(
            (productData) => productData["productId"].toString() === productId
        );

        // if product exist thus increasing its quantity
        if (isProductExistsInCart.length > 0) {
            const updateExistingProductQuantity = await CartModel.findOneAndUpdate({ userId: userId, "items.productId": productId }, 
            {
                $inc: {totalPrice: +productByProductId.price,"items.$.quantity": +1,},
            },
            { new: true });

            return res
                .status(201)
                .send({status: true,message: "Product quantity updated to cart",data: updateExistingProductQuantity});
        }

        // if product id coming from request body is not present in cart thus adding new product to cart
        const addNewProductToCart = await CartModel.findOneAndUpdate({ userId: userId }, {
            $addToSet: { items: { productId: productId, quantity: 1 } },
            $inc: { totalItems: +1, totalPrice: +productByProductId.price },
        }, { new: true });

        return res
            .status(201)
            .send({status: true,message: "Item updated to cart",data: addNewProductToCart});
     
    }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const getCart = async function(req, res) {
    try {
      
        const queryParams = req.query;
        

        const user = req.user; //decoded token
        const userId=user.id
       console.log("inside endpoint", user);

        if (isValidInputBody(queryParams)) {
            return res
                .status(404)
                .send({ status: false, message: " page not found" });
        }
        if (user.role !== "User") {
            //const data = await userModel.findById(user.id);
            res.status(200).json({ message: "Sorry you are not User" });
          }else{
        
        // user cart details
        const cartByUserId = await CartModel.findOne({ userId: userId });

        if (!cartByUserId) {
            return res
                .status(404)
                .send({ status: false, message: " user does not exist" });
        }

        return res
            .status(200)
            .send({status: true,message: "Cart details are here",data: cartByUserId,});
    }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

module.exports = {
    AddProductToCart,
    
    getCart,
    
};