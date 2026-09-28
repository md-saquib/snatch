import productModel from "../model/product.model.js";
import { uploadFile } from "../services/storage.services.js";



export const createProduct = async (req, res) => {

    const { title, description, price, sizes } = req.body

    const userId = req.user.id


    const uploadPromise = req.files.map(async (element) => {
        const res = await uploadFile(element.buffer, element.originalname)
        return res.url
    })

    const imgUrl = await Promise.all(uploadPromise)


    try {

        const product = await productModel.create({
            title,
            description,
            price,
            sizes,
            images: imgUrl,
            userId
        })


        return res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error in product create api ',
            error: error.message
        })
    }
}

export const allProduct = async (req, res) => {

    try {

        const allData = await productModel.find()

        return res.status(200).json({
            success: true,
            message: 'successfully fetch all data',
            data: allData
        })

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: 'internal server error fetching allData api',
            error: error.message
        })
    }
}


export const productById = async (req, res) => {

    const { id } = req.params

    try {

        const data = await productModel.findById(id)

        return res.status(200).json({
            success: true,
            message: 'successfully fetch data by id',
            data: data
        })

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: 'internal server error fetching data productById api',
            error: error.message
        })
    }
}


export const productDeleteById = async (req, res) => {

    const { id } = req.params

    try {

        const data = await productModel.findByIdAndDelete(id)

        if (!data) {
            return res.status(404).json({
                success: false,
                message: 'Product already Deleted',
            })
        }

        return res.status(200).json({
            success: true,
            message: 'successfully delete data by id',
            data: data
        })

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: 'internal server error deleting data productDeleteById api',
            error: error.message
        })
    }
}

export const updateProductById = async (req, res) => {

    const { id } = req.params
    const userId = req.user.id

    try {

        if ((!req.body || Object.keys(req.body).length === 0) && (!req.files || req.files.length === 0)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide at least one field or image to update'
            });
        }
        const updatedData = { ...req.body, userId }

        if (req.files && req.files.length > 0) {

            const url = req.files.map(async (val) => {
                const res = await uploadFile(val.buffer, val.originalname)
                return res.url
            })

            const imgUrl = await Promise.all(url)

            updatedData.images = imgUrl

        }

        const data = await productModel.findByIdAndUpdate(id, updatedData, { new: true })

        if (!data) {
            return res.status(404).json({
                success: false,
                message: 'Product Not found',
            })
        }

        return res.status(200).json({
            success: true,
            message: 'successfully update product data by id',
            data: data
        })

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: 'internal server error updating data updateProductById api',
            error: error.message
        })
    }
}