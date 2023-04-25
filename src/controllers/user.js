import user from "../model/user";
import error from "../utils/error";

const GET = async (req, res, next) => {
    try {
        const { userId } = req.params

    } catch (error) {
        console.log(error.message);
        return next(error)
    }
}

export default {}
GET