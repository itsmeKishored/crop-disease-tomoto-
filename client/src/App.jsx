import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Signup from './Signup'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Login from './Login'
import Home from './Home'
import MainHome from './MainHome'

function App() {
  return (
   <BrowserRouter>
   <Routes>
   
    <Route path='/register' element={<Signup/>}></Route>
    <Route path='/login' element={<Login/>}></Route>
    
    <Route path='/' element={<Home/>}></Route>
    <Route path='/Mainhome' element={<MainHome/>}></Route>
    
   </Routes>
   </BrowserRouter>
  )
}

export default App