import React from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Toaster } from "react-hot-toast"
import Footer from './components/Footer'

const App = () => {

  // this means that if the url contains the seller the we are in seller dashboard and isSellerPath will be true
  const isSellerPath = useLocation().pathname.includes("seller");

  return (
    <div>
      {/* This navbar is for users thus if isSellerPath is true then provide null*/}
      { isSellerPath ? null :  <Navbar/>}

      <Toaster/>

      {/* here this div of home section is displayed for the regular users not sellers thus is isSellerPath is true then display nothing from this div */}
      <div className={` ${isSellerPath ? ""  : "px-6 md:px-16 lg:px-24 xl:px-32"}`} >
      {/* Home path is displayed only when we are on Home("/") route */}
        <Routes>
          <Route path='/' element = {<Home/>} />
        </Routes>
      </div>

      {/* Footer Section present in all pages except the seller dahboard */}
      {!isSellerPath && <Footer/>}
    </div>
  )
}

export default App