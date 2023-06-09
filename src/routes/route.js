const express = require('express')
const router = express.Router()
const UserController = require('../controllers/userController')
const Auth = require('../middleWares/commonMW')
const ProductController = require('../controllers/productController')
 const CartController = require('../controllers/cartController')



//test-api
router.get('/test-me', function(req, res) {
    res.send({ status: true, message: "test-api working fine" })
})


//*********************************USER API************************************************** */
router.post('/register', UserController.userRegistration)
router.post('/login', UserController.userLogin)


//*********************************PRODUCT API**************************************************** */
router.post('/products',Auth.authentication, ProductController.registerProduct)
router.get('/products/:productId',Auth.authentication, ProductController.getProduct)
router.get('/getAllProducts',Auth.authentication, ProductController.getAllProducts)
router.put('/updateProduct/:productId',Auth.authentication, ProductController.updateProduct)
router.delete('/deleteProduct/:productId',Auth.authentication, ProductController.deleteProduct)


// //*************************************CART API***************************************************** */
 router.post('/AddProductToCart', Auth.authentication,/*Auth.authorization*/ CartController.AddProductToCart)
// router.put('/users/:userId/cart', Auth.authentication, Auth.authorization, CartController.removeProductFromCart)
 router.get('/getCart', Auth.authentication, CartController.getCart)
// router.delete('/users/:userId/cart', Auth.authentication, CartController.emptyCart)



router.all("/*", function (req, res) {
    res
        .status(400)
        .send({ status: false, message: "invalid http request" });
});

module.exports = router