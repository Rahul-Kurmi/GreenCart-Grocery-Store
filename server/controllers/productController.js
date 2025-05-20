// to upload the image we will use cloudinary and we will store the images at cloudinary
import { v2 as cloudinary } from 'cloudinary'
import Product from '../models/Product.js';

// ADD PRODUCT : /api/product/add
export const addProduct = async (req, res) => {
    try {
        let productData = JSON.parse(req.body.productData);

        const images = req.files; // array of all the images uploaded by user

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path,
                    { resource_type: 'image' });
                // in the result we will get the URL of our uploaded image with a property called secure URL
                return result.secure_url ;
            })
        )

        await Product.create({...productData, image: imagesUrl}) ;

        res.json({
            success  : true ,
            message :  "Product Added"
        })

    } catch (error) {
        console.log(error.message) ;
        
        res.json({
            success : false,
            message : error.message
        })
    }
}

// GET PRODUCT : /api/product/list
export const productList = async (req, res) => {
    try {
        const products = await Product.find({}); // return all the products 

        res.json({
            success : true ,
            products
        })

    } catch (error) {
        console.log(error.message) ;
        
        res.json({
            success : false,
            message : error.message
        })
    }
}

// GET SINGLE PRODUCT : /api/product/id
export const productById = async (req, res) => {
    try {
        const { id } = req.body ;
        const product = await Product.findById(id);

        res.json({
            success : true ,
            product
        })

    } catch (error) {
        console.log(error.message) ;
        
        res.json({
            success : false,
            message : error.message
        })   
    }
}

// CHANGE PRODUCT In-Stock : /api/product/stock
export const changeStock = async (req, res) => {
    try {
        const { id , inStock } = req.body ;  
        await Product.findByIdAndUpdate(id , {inStock}) ;

        res.json({
            success : true ,
            message : "Stock Updated"
        })
        
    } catch (error) {
        console.log(error.message) ;
        
        res.json({
            success : false,
            message : error.message
        }) 
    }
}