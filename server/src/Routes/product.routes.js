

import express from "express";
import { authenticateMe } from "../middleware/verifyUser.js";
import { productValidator } from "../validator/product.validator.js";
import { createProduct, allProduct, productById, productDeleteById, updateProductById } from "../controller/products.controller.js";
import upload from '../multer/multer.image.js'
import { parseStringIntoNumberDuringApiCall } from "../middleware/parseMiddleware.js";
import { paramValidator } from "../validator/paramsId.validator.js";

const router = express.Router()

/**
 * @method POST
 * @route /api/product
 * @access user
 * @description create a product and save in DB and image will store in imagekit and provided link store in db
 */
router.post('/createproduct', authenticateMe, upload.array('images'),
    parseStringIntoNumberDuringApiCall, productValidator, createProduct)


/**
 * @method GET
 * @route /api/product/allproducts
 * @access user
 * @description get all product data which will store in db 
 */

router.get('/allproducts', allProduct)

/**
 * @method GET
 * @route /api/product/:id
 * @access user
 * @description get  product data by id which will store in db 
 */

router.get('/:id', paramValidator, productById)


/**
 * @method DELETE
 * @route /api/product/:id
 * @access user
 * @description Thsi api delete the specific product by id in database  
 */

router.delete('/:id', paramValidator, authenticateMe, productDeleteById)


/**
 * @method PATCH
 * @route /api/product/updateproduct/:id
 * @access user
 * @description Thsi api basically find product by id and then update the product and save it in db  
 */

router.patch('/updateproduct/:id', paramValidator, authenticateMe, upload.array('images'),
    parseStringIntoNumberDuringApiCall, updateProductById)


export default router