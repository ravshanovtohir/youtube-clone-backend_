import error from "../utils/error.js"
import Joi from "joi"

const userValidation = Joi.object({
    username: Joi.string().min(5).max(30).alphanum().required(),
    password: Joi.string().min(6).max(15).pattern(new RegExp(/(?=.*[A-Za-z]+)(?=.*[0-9]+)(?=.*[@$!%*#?&]+)/)).required()
})

const regValidation = (req, res, next) => {
    const { value, err } = userValidation.validate(req.body)

    if (err) return next(new error.ValidationError(400, err.message))

    return next()
}


export default regValidation