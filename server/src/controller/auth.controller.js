import userModel from "../model/user.model.js";
import bcrypt from 'bcryptjs'
import { refreshTokenVerifier, tokengerator } from "../utils/authTokenGenerator.js";
import config from "../config/config.js";

export const Register = async (req, res) => {


    try {

        const { fullName, email, password, role } = req.body;

        const isExist = await userModel.findOne({ email })

        if (isExist) return res.status(400).json({
            message: 'User already Exist..'
        })

        const user = await userModel.create({
            fullName,
            email,
            password: await bcrypt.hash(password, 12)
        })

        const { accessToken, refreshToken } = tokengerator(user._id)

        user.refreshToken = refreshToken
        await user.save()

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: config.NODE_ENV === 'production',
            sameSite: config.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days milliseconds mein
        });

        return res.status(201).json({
            success: true,
            message: 'User register successfully',
            data: {
                name: user.fullName,
                email: user.email,
                id: user._id
            },
        })

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: 'Internal server Error..',
            error: error.message
        })
    }
}

export const HydrateUser = async (req, res) => {

    const userId = req.user.id


    const user = await userModel.findById(userId).select('-password -refreshToken')

    return res.status(200).json({
        success: true,
        message: 'Success Hydrate the user',
        data: user,


    })


}

export const Login = async (req, res) => {

    const { email, password } = req.body

    try {
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'email or passwrod required during login ..'
            })
        }
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'user not found'
            })
        }

        const correctpassword = await bcrypt.compare(password, user.password)

        if (!correctpassword) {
            return res.status(401).json({
                success: false,
                message: "invalid email or password"
            })
        }

        const { accessToken, refreshToken } = tokengerator(user._id)

        user.refreshToken = refreshToken
        await user.save()

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: config.NODE_ENV === 'production',
            sameSite: config.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days milliseconds mein
        });
        user.password = null

        return res.status(200).json({
            success: true,
            message: 'login successfull',
            data: {
                user,
                accessToken
            }

        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server Error during login",
            error: error.message
        })
    }



}

export const RefreshToken = async (req, res) => {

    const refresh = req.cookies.refreshToken

    try {

        if (!refresh) return res.status(401).json({
            message: 'refreshToken not found unauthorized'
        })

        const decode = refreshTokenVerifier(refresh)

        const user = await userModel.findById(decode.id).select('-password')

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (refresh !== user.refreshToken) {
            user.refreshToken = null
            await user.save()
            return res.status(403).json({
                message: "suspesious behaviour detected...  logout from all devices..."
            })
        }

        const { accessToken, refreshToken } = tokengerator(decode.id)

        user.refreshToken = refreshToken
        await user.save()

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: config.NODE_ENV === 'production',
            sameSite: config.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days milliseconds mein
        });

        return res.status(200).json({
            success: true,
            message: 'successfully generated tokens..',
            data: {
                user,
                accessToken
            }
        })

    } catch (error) {
        console.error("Error in RefreshToken controller: ", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error. Could not refresh token.",
            error: error.message
        });

    }
}

export const Logout = async (req, res) => {

    const userId = req.user.id

    try {
        const user = await userModel.findByIdAndUpdate(userId, { $unset: { refreshToken: 1 } })

        res.clearCookie('refreshToken', {
            httpOnly: true
        })

        return res.status(200).json({
            success: true,
            message: 'Logout successfull'
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server Error In logout api..',
            error: error.message
        })
    }


}