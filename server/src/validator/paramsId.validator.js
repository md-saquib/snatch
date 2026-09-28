
import { param, validationResult } from 'express-validator'

export const paramValidator = [
    param('id').isMongoId().withMessage('invalid mongoid passed in Url '),

    (req, res, next) => {
        const error = validationResult(req)

        if (!error.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation fail hogaya bhii',
                error: error.array()
            })
        }
        next()
    }
]