const ProductModel = require("../models/productModel");
const authentication = require("../middleWares/commonMW");
const {
  isValidInputBody,
  isValidInputValue,
  isValidOnlyCharacters,
  isValidAddress,
  isValidEmail,
  isValidPhone,
  isValidPassword,
  isValidNumber,
  isValidPincode,
  isValidPrice,
  isValidObjectId,
  isValidImageType,
} = require("../utilities/validator");
const getSymbolFromCurrency = require("currency-symbol-map");
const { Convert } = require("easy-currencies");
const productModel = require("../models/productModel");

//create product

const registerProduct = async function (req, res) {
  try {
    const requestBody = req.body;
    const queryParams = req.query;

    const user = req.user; //decoded token
    console.log("inside endpoint", user);

    if (user.role !== "Admin") {
      // const data = await userModel.findById(user.id);
      res
        .status(404)
        .json({
          message: "Sorry you are not Admin, you cannot create products",
        });
    } else {
      // data not required from query params
      if (isValidInputBody(queryParams)) {
        return res
          .status(404)
          .send({ status: false, message: "Page not found" });
      }
      // request body must not be empty
      if (!isValidInputBody(requestBody)) {
        return res
          .status(400)
          .send({
            status: false,
            message: "Product data is required for registration",
          });
      }

      let { title, price, type } = requestBody;

      // validation starts here
      if (!isValidInputValue(title)) {
        return res
          .status(400)
          .send({ status: false, message: "Product title is required" });
      }

      const notUniqueTitle = await ProductModel.findOne({ title: title });

      if (notUniqueTitle) {
        return res
          .status(400)
          .send({ status: false, message: "Product title already exist" });
      }

      if (!isValidNumber(price) || !isValidPrice(price)) {
        return res
          .status(400)
          .send({ status: false, message: "Enter a valid product price" });
      }

      if (type) {
        if (!isValidInputValue(type)) {
          return res
            .status(400)
            .send({
              status: false,
              message: "product type should be in valid format",
            });
        }
      }

      const productData = {
        title: title.trim(),
        price: Number(price),
        type: type,
        deletedAt: null,
        isDeleted: false,
      };

      const newProduct = await ProductModel.create(productData);

      res
        .status(201)
        .send({
          status: true,
          message: "new product added successfully",
          data: newProduct,
        });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// getProduct
const getProduct = async (req, res) => {
  try {
    const productId = req.params.productId;

    const user = req.user; //decoded token
    console.log("inside endpoint", user);

    if (user.role !== "Admin") {
      //const data = await userModel.findById(user.id);
      res.status(200).json({ message: "Sorry you are not Admin" });
    } else {
      console.log("productId of Product", productId);
      const anyData = await ProductModel.findById(productId);
      res.status(200).json({ message: "Admin", data: anyData });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get All Products
const getAllProducts = async (req, res) => {
  try {
    const user = req.user;
    console.log("inside endpoint", user);

    if (user.role !== "Admin") {
      return res.status(404).json({ message: "Sorry you are not Admin" });
    }

    const getAllProducts = await ProductModel.find();
    res.status(200).json({ data: getAllProducts });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update  Product
const updateProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    console.log("productId of product", productId);
    let Body = req.body;
    let filter = {};
    const user = req.user; //decoded token
    console.log("inside endpoint", user);
    //console.log(Body);

    if (Body["title"]) {
      filter[" title"] = Body["title"];
    }
    if (Body["price"]) {
      filter["price"] = Body["price"];
    }
    if (Body["type"]) {
      filter["type"] = Body["type"];
    }
    // console.log(filter)
    if (user.role !== "Admin") {
     
      res.status(200).json({
        message: "Sorry you are not Admin, you can not update products",
      });
    } else {
      const anyData = await productModel.findByIdAndUpdate(
        { _id: productId },
        filter,
        { new: true }
      );
      res.status(200).json({ message: "Admin", data: anyData });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//delete product

const deleteProduct = async (req, res) => {
    try {
      const productId = req.params.productId;
     //console.log("productid -",productId)
      const user = req.user; //decoded token
      console.log("inside endpoint", user);
  
      if (user.role !== "Admin") {
        
        res.status(200).json({ message: "Sorry you are not Admin" });
      } else {
         // checking product available by given product ID 
         const productById = await ProductModel.findOne({
            _id: productId,
            isDeleted: false,
            deletedAt: null,
        });
        console.log("check -",productById) //
        if (!productById) {
            return res
                .status(404)
                .send({status: false,message: "No product found by this product id"});
        }

        // updating product isDeleted field
        const markDircty = await ProductModel.findOneAndUpdate({ _id: productId }, { $set: { isDeleted: true, deletedAt: Date.now() } });

        res
            .status(200)
            .send({ status: true, message: "Product successfully deleted" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

//**********************************EXPORTING PRODUCT RELATED HANDLER FUNCTION******************************* */

module.exports = {
  registerProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  deleteProduct
};
