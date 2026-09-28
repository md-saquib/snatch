import { accessTokenVerifier } from "../utils/authTokenGenerator.js"


export const authenticateMe = (req, res, next) => {


    let accessToken = req.headers.authorization?.split(' ')[1]

    if (!accessToken) return res.status(401).json({
        success: false,
        message: 'authorization error token missing'
    })


    try {
        const decode = accessTokenVerifier(accessToken)

        req.user = decode
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'authorization error accessToken not verified'
        })
    }



    next()
}