// Function that will register the user in the database

import User from "../models/User.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// REGISTER USER : /api/user/register
export const register = async (req , res) => {
    try {
        const {name , email , password} = req.body ;

        if(!name || !email || !password){
            return res.json({success : false , message : "Missing Details"});
        }

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.json({success : false , message : "User already exist"});
        }

        const hashedPassword = await bcrypt.hash(password , 10);

        const user = await User.create({name, email, password : hashedPassword});

        const token = jwt.sign({id: user._id }, process.env.JWT_SECRET, {expiresIn : '7d'});

        res.cookie('token', token, {
            httpOnly: true, // Prevent JavaSript to access the cookie
            secure: process.env.NODE_ENV === 'production', // use secure cookie in production
            // whenever NODE_ENV will be production it will be true 
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            // CSRF protection
            maxAge : 7 * 24 * 60 * 60 * 1000, // Cookie Expiration time in ms (7 days)
        });

        return res.json({
            success : true, 
            user : {email: user.email, name: user.name}
        });
        
    } catch (error) {
        console.log(error.message);
        res.json({success : false , message : error.message});
    }
}


// LOGIN USER : /api/user/login
export const login = async (req , res) => {
    try {
        const {email , password} = req.body ;

        if(!email || !password){
            return res.json({
                success : false, 
                message : "Email and password are required"
            });    
        }

        const user = await User.findOne({email});

        if(!user){
            return res.json({
                success : false,
                message : "Invalid Email or Password"
            })
        }

        // compare the password(send by user) and hashedPassword(stored in users DB) ie. user.password
        const isMatch = await bcrypt.compare(password , user.password)

        if(!isMatch){
            return res.json({
                success : false,
                message : "Invalid Email or Password"
            })
        }

        const token = jwt.sign({id: user._id }, process.env.JWT_SECRET, {expiresIn : '7d'});

        res.cookie('token', token, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',  
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge : 7 * 24 * 60 * 60 * 1000, 
        });

        return res.json({
            success : true, 
            user : {email: user.email, name: user.name}
        });


    } catch (error) {
        console.log(error.message);
        res.json({success : false , message : error.message});
    }
} 


// CHECK AUTH  : /api/user/is-auth
export const isAuth = async (req ,res) => {
    try {
        const userId = req.userId ;

        // select("-password") this will exculde the password from the user data as we are returning user in the response 
        const user = await User.findById(userId).select("-password");

        return res.json({
            success : true, 
            user
        })

    } catch (error) {
        return res.json({
            success : false,
            message : error.message 
        })
    }
}


// LOGOUT USER : /api/user/logout
export const logout = async (req ,res) => {
    try {
        // here we have to clear the cookie
        res.clearCookie('token', {
            httpOnly : true,
            secure: process.env.NODE_ENV === 'production',  
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });

        return res.json({
            success : true,
            message : "Logged Out"
        })

    } catch (error) {
        return res.json({
            success : false,
            message : error.message 
        })
    }
}
