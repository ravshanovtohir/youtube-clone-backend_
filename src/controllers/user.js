import user from "../model/user.js";
import User from "../model/user.js";
import error from "../utils/error.js";

const GET = async (req, res, next) => {
    try {
        const { userId } = req.params
        if (parseInt(userId)) {
            let user = await User.findById(userId)

            user = user.toObject()

            delete user.password

            return res
                .status(200)
                .json({
                    status: 200,
                    data: user
                })

        }

        let users = await User.find()

        users = users.map(el => {
            el = el.toObject()
            delete el.password
            return el
        })


        return res
            .status(200)
            .json({
                status: 200,
                data: users

            })

    } catch (error) {
        console.log(error.message);
        return next(error)
    }
}



export default {
    GET
}
