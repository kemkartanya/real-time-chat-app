import jwt from 'jsonwebtoken'
import User from '../models/user.js'

export const authenticate = async (req, res, next) => {

    // get token from headers
    const authToken = req.headers.authorization

    // check token is exists 
    if(!authToken || !authToken.startsWith('Bearer ')) {
        return res.status(401).json({success: false, message: 'No token, authorization denied'})
    }

    try {

        const token = authToken.split(" ")[1];

        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        req.userId = decoded.id 

        next();  // must be call the next function 
    } catch (err) {

        if(err.name === 'TokenExpiredError') {
            return res.status(401).json({message: 'Token is expired'});
        }

        return res.status(401).json({success: false, message: 'Invalid token', err});
    }
}

export const restrict = roles => async(req, res, next) => {
    const userId = req.userId // token is used to find user & user.id & user.role 

    let user;

    const client = await User.findById(userId);

    if(client) {
        user = client
    }

    if(!roles.includes(user.role)) {
        return res.status(401).json({success: false, message: "You're not authorized"})
    }

    next();
}