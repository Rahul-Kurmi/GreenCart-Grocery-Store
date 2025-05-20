import jwt from "jsonwebtoken";


const authUser = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.json({
            success: false,
            message: "Not Authorized"
        })
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        // this decoded tokenDecode will have an id as at the time of encoding we have passed id 
        if (tokenDecode.id) {
           req.userId = tokenDecode.id; 
           // Not --> req.body.userId = tokenDecode.id; 
           // As Express does not parse a body for GET requests
        } else {
            return res.json({
                success: false,
                message: "Not Authorized"
            })
        }

        next();

    } catch (error) {
        return res.json({
            success : false,
            message : error.message 
        })
    }
}

export default authUser ;