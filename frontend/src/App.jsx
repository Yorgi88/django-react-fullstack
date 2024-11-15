import { useState } from 'react';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

function Logout() {
  localStorage.clear();
  return <Navigate to={'/login'}/>
}

function RegisterAndLogout() {
  localStorage.clear();
  return <Register/>
}

function App() {

  return (
    <>
    <BrowserRouter future={{ v7_startTransition: true }}>
      <Routes>
        <Route path='/' element={
          <ProtectedRoute>
            <Home/>
          </ProtectedRoute>
        }/>

        <Route path='/login' element={<Login/>}/>
        <Route path='/logout' element={<Logout/>}/>

        <Route path='/register' element={<RegisterAndLogout/>}/>
        {/* this registers and logs out by removing the tokens */}

        <Route path='*' element={<NotFound/>}/>


      </Routes>
    </BrowserRouter>
     
    </>
  )
}

export default App