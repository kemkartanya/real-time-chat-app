// authorization, user has access to particular data or not 
import User from '../models/user.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const generateToken = user => {
    return jwt.sign({id:user.id, role:user.role}, process.env.JWT_SECRET_KEY, {
        expiresIn: '15d',
    })
}

export const register = async(req, res) => {

    const { password, username } = req.body

    try {

        let user = null

        user = await User.findOne({username})

        // check if user exist
        if(user) {
            return res.status(400).json({message: 'User already exist'})
        }

        // hash password 
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        user = new User({
            username,
            // email,
            password: hashPassword,
        })

        await user.save()

        res.status(200).json({success:true, message:'User successfully created'})
        
    } catch (error) {
        res.status(500).json({success:false, message:'Internal server error, try again', error})
    }
}


export const login = async(req, res) => {

    const {username} = req.body

    try {

        let user = null

        user = await User.findOne({username})

        // check if user exist or not
        if(!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // compare password
        const isPasswordMatch = await bcrypt.compare(req.body.password, user.password)

        if(!isPasswordMatch) {
            return res.status(404).json({ status: false, message: 'Invalid credentials' });
        }

        // get token
        const token = generateToken(user)

        const {password, ...rest} = user._doc

        res
        .status(200)
        .json({ status: true, message: 'Successfully login', token, data:{...rest}, });
        
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to login'});
    }
}