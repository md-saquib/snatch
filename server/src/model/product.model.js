import mongoose from "mongoose";



const productSizeSchema = mongoose.Schema({
    size: {
        type: String,
        required: true,
        enum: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL']
    },
    stock: {
        type: Number,
        required: true,
        min: 1
    }
})

const productPriceSchema = mongoose.Schema({

    currency: {
        type: String,
        required: true,
        enum: ['USD', 'INR']
    },
    amount: {
        type: Number,
        required: true,
        min: 1
    }

})


const productSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 100
    },
    description: {
        type: String,
        required: true,
        minLength: 10,
        maxLength: 500
    },
    images: {
        type: [String],
        required: true,
        validate: {
            validator: val => val.length <= 5,
            message: 'Limit exceed Not more then 5 pic in one go..'
        }
    },
    sizes: [productSizeSchema],
    price: productPriceSchema,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    isPublic: {
        type: Boolean,
        default: false
    }
})

const productModel = mongoose.model('products', productSchema)

export default productModel