import User from "../model/user.js";
import error from "../utils/error.js";
import JWT from "../utils/JWT.js";
import sha256 from "sha256";
import fs from "fs"
import path from "path";
import { log } from "console";

const REGISTER = async (req, res, next) => {
    try {
        const { username, password } = req.body
        const file = req.files
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
        const agent = req.headers['user-agent']



        if (!username) {
            return next(
                new error.AuthorizationError(409, "Username required")
            )
        }

        if (!password) {
            return next(
                new error.AuthorizationError(409, "password required")
            )
        }

        if (username.length > 30 || username.length < 6
        ) {
            return next(
                new error.AuthorizationError(409, "Invalid length for username. Length of username must be more then 6 and less then 30")
            )
        }

        if (password.length > 12 || password.length < 6
        ) {
            return next(
                new error.AuthorizationError(409, "Invalid length for password. Length of username must be more then 6 and less then 12")
            )
        }

        const oldUser = await User.findOne({ user_name: username })

        if (oldUser) {
            return next(
                new error.AuthorizationError(409, "User Already Exist. Please Login")
            )
        }

        if (!req.files) {
            return next(
                new error.ValidationError(400, "The file argument is required!")
            )
        }

        const { size, mimetype, data, name } = file.files

        if (size > (10 * 1024 * 1024)) {
            return next(
                new error.ValidationError(413, "The file larger than 10MB!")
            )
        }

        if (!['image/png', 'image/jpeg', 'image/jpg'].includes(mimetype)) {
            return next(
                new error.ValidationError(415, "The file must be jpg or png!")
            )
        }

        const fileName = Date.now() + name.replace(/\s/g, '')
        const pathName = path.join(process.cwd(), 'files', 'images', fileName)
        fs.writeFileSync(pathName, data)

        const user = await User.create({
            user_name: username,
            profile_img: "/images/" + fileName,
            password: sha256(password)
        })

        return res
            .status(201)
            .json({
                status: 201,
                message: 'The user successfully registired!',
                token: JWT.sign({ user_id: user._id, username, ip, agent }),
                data: user
            })

    } catch (error) {
        console.log(error.message)
        return next(error)
    }
}

const LOGIN = async (req, res, next) => {
    try {

        const { username, password } = req.body
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
        const agent = req.headers['user-agent']

        if (!(username || password)) {
            return next(
                new error.ValidationError(400, "Input is required")
            )
        }

        const user = await User.findOne({ user_name: username, password: sha256(password) })

        if (!user) {
            return next(
                new error.AuthorizationError(400, "Invalid username or password")
            )
        }

        return res
            .status(200)
            .json({
                status: 200,
                message: 'The user successfully logged in!',
                token: JWT.sign({ user_id: user._id, username, ip, agent }),
                data: user
            })


    } catch (error) {
        console.log(error.message);
        return next(error)
    }
}

export default {
    REGISTER,
    LOGIN
}