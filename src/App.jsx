import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import './App.css'
import Users from './pages/Users'
import Header from './components/Header'
import Categories from './pages/Categories'
import Products from './pages/Products'

function App() {

  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/users" element={<Users />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/products" element={<Products />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users" element={<Users />} />

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
