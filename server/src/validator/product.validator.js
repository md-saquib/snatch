import { body, validationResult } from 'express-validator'

export const productValidator = [

    body('title').
        trim().
        notEmpty().withMessage('Bhai title bhejna jaruri h').
        isLength({ min: 2, max: 100 }).withMessage('Bhai title kam se kam 2 or jada se jada 100'),

    body('description').
        trim().
        notEmpty().withMessage("Dekh bhai description khali nahi aana chaiyee").
        isLength({ min: 10, max: 500 }).withMessage('bhai description kam se kam 10 or jada se jada 500'),

    body('sizes.*.size').
        trim().
        notEmpty().withMessage('Dekh bhi size select karna jaruri h').
        isIn(['S', 'M', 'L', 'XL', 'XXL', 'XXXL']).withMessage('Dekh bhi size esme see hii selet karna h'),

    body('sizes.*.stock').trim().
        isNumeric().withMessage('Dekh bhi stock number me hona chaiye').
        isInt({ min: 1 }).withMessage('Dekh bhai minimum quantity 1 hona chahiye').
        toInt(),

    body('images.*.image').trim().
        notEmpty().withMessage('Dekh bhi image ka url jaruri h').
        isURL().withMessage('Dekh bhi image ka valid URL dalna h '),


    body('sizes').isArray({ min: 1 }),

    body('price.amount').trim().
        isNumeric().withMessage('Dekh bhi amount jaruri h').
        isFloat({ min: 1 }).withMessage('Dekh bhi minimum ek rupya hona chahiye price').
        toFloat(),

    body('price.currency').trim().
        notEmpty().withMessage('Dek bhi currency select karna jaruri h').
        isIn(['USD', 'INR']).withMessage('Dekh bhai en dono me se koi hona chahiye or eske bahar hua to not accept'),



    (req, res, next) => {
        const error = validationResult(req)

        if (!error.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation fail hogaya bhi',
                error: error.array()
            })
        }
        next()
    }
]