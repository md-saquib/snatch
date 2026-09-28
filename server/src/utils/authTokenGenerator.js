import jwt from 'jsonwebtoken'
import config from '../config/config.js'

export const tokengerator = (userId) => {

    const accessToken = jwt.sign({ id: userId }, config.ACCESS_SECRET_KEY, { expiresIn: '15m' })

    const refreshToken = jwt.sign({ id: userId }, config.REFRESH_SECRET_KEY, { expiresIn: '7d' })

    return { accessToken, refreshToken }
}

export const accessTokenVerifier = (token) => {

    return jwt.verify(token, config.ACCESS_SECRET_KEY);
}


export const refreshTokenVerifier = (token) => {

    return jwt.verify(token, config.REFRESH_SECRET_KEY);
}
