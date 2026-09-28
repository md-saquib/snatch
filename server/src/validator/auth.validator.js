import { body, validationResult } from 'express-validator';

export const validateUserRegistration = [
    // 1. Validation Rules
    body('fullName')
        .trim()
        .notEmpty().withMessage('Name is required').bail()
        .isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required').bail()
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Password is required').bail()
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),



    // 2. Error Handling Middleware
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next(); // Proceed to the controller if validation passes
    }
];