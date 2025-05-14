import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

    const currency = import.meta.env.VITE_CURRENCY;

    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isSeller, setIsSeller] = useState(false);
    const [showUserLogin, setShowUserLogin] = useState(false);

    // to get the dummyproducts
    const [products, setProducts] = useState([]);
    // for the cart in which user keep items
    const [cartItems, setCartItems] = useState({});
    // EG : how cartItems are stored
    /*
            {
                "gd46g23h": 2, // Potato x2
                "as64jds9": 1  // Tomato x1
            }

    */

    
    const [searchQuery, setSearchQuery] = useState({});

    // Fetch All Products
    const fetchProducts = async () => {
        setProducts(dummyProducts)
    }

    // fetch the products from assets ie. a dummyProducts ie. set the dummyProducts in setProducts for the first time 
    useEffect(() => {
        fetchProducts();
    }, [])


    // Add Product to cart
    const addToCart = (itemId) => {
        let cartData = structuredClone(cartItems);

        // If item alreay is in the cart 
        if (cartData[itemId]) {
            cartData[itemId] += 1;
        }
        // if new item added in cart 
        else {
            cartData[itemId] = 1;
        }
        setCartItems(cartData);
        toast.success("Added to Cart");
    }

    // Update Cart Item quantity
    const updateCartItems = (itemId, quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId] = quantity;
        setCartItems(cartData);
        toast.success("Cart Updated");
    }

    // Remove Product from Cart 
    const removeFromCart = (itemId) => {
        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            cartData[itemId] -= 1;
            if (cartData[itemId] === 0) {
                delete cartData[itemId];
            }
        }
        toast.success("Removed from Cart");
        setCartItems(cartData);
    }


    // Function that calculates the total Cart Items
    const getCartCount = () => {
        // EG : cartItems = { "apple": 2, "banana": 3, "orange": 1 }
        let totalCount = 0 ;
        for(const item in cartItems){
            // For example: cartItems["apple"] = 2, So we add that quantity to totalCount
            totalCount += cartItems[item];
        }

        return totalCount ;
    }

    // Get Cart total Amount
    const getCartAmount = () => {
        let totalAmount = 0 ;
        for(const item in cartItems){
            let itemInfo = products.find((products) => products._id === item);
            if(cartItems[item] > 0 ){
                totalAmount += itemInfo.offerPrice * cartItems[item];
            }
        }
        return Math.floor(totalAmount * 100) / 100 ;
    }

    const value = { navigate, user, setUser, isSeller, setIsSeller, showUserLogin, setShowUserLogin, products, currency, addToCart, updateCartItems, removeFromCart, cartItems , searchQuery , setSearchQuery, getCartCount, getCartAmount };

    return (
        <AppContext.Provider value={value} >
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    return useContext(AppContext);
}