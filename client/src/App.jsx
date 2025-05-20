import React from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Toaster } from "react-hot-toast"
import Footer from './components/Footer'
import { useAppContext } from './context/AppContext'
import Login from './components/Login'
import AllProducts from './pages/AllProducts'
import ProductCategory from './pages/ProductCategory'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import AddAddress from './pages/AddAddress'
import MyOrdres from './pages/MyOrdres'
import SellerLogin from './components/seller/SellerLogin'
import SellerLayout from './pages/seller/SellerLayout'
import AddProduct from './pages/seller/AddProduct'
import ProductList from './pages/seller/ProductList'
import Orders from './pages/seller/Orders'
import Loading from "./components/Loading"

const App = () => {

  // this means that if the url contains the seller the we are in seller dashboard and isSellerPath will be true
  const isSellerPath = useLocation().pathname.includes("seller");

  const {showUserLogin, isSeller} = useAppContext();

  return (
    <div className='text-default min-h-screen text-gray-700 bg-white'>
      {/* This navbar is for users thus if isSellerPath is true then provide null*/}
      { isSellerPath ? null :  <Navbar/>}

      {showUserLogin ? <Login/> : null}

      <Toaster/>

      {/* here this div of home section is displayed for the regular users not sellers thus is isSellerPath is true then display nothing from this div */}
      <div className={` ${isSellerPath ? ""  : "px-6 md:px-16 lg:px-24 xl:px-32"}`} >
      {/* Home path is displayed only when we are on Home("/") route */}
        <Routes>
          <Route path='/' element = {<Home/>} />
          <Route path='/products' element = {<AllProducts/>} />  
          <Route path='/products/:category' element = {<ProductCategory/>} />  
          <Route path='/products/:category/:id' element = {<ProductDetails/>} />  
          <Route path='/cart' element = {<Cart/>} />  
          <Route path='/add-address' element = {<AddAddress/>} />  
          <Route path='/my-orders' element = {<MyOrdres/>} />  
          <Route path='/loader' element = {<Loading/>} />  
          <Route path='/seller' element={isSeller ? <SellerLayout/> : <SellerLogin/>}>
            <Route index element={isSeller ? <AddProduct/> : null} />
            <Route path='product-list' element={<ProductList/>} />
            <Route path='orders' element={<Orders/>} />
          </Route>
        </Routes>
      </div>

      {/* Footer Section present in all pages except the seller dahboard */}
      {!isSellerPath && <Footer/>}
    </div>
  )
}

export default App