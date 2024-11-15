import React from 'react'
import { useState } from 'react'
import api from '../api'
import { useNavigate } from 'react-router-dom'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants'
import '../styles/form.css';
import LoadingIndicator from './LoadingIndicator'

const Form = ({route, method}) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    // state for storin the username and pass that the user is typing in
    const [password, setPassword] = useState('');

    const [loading, setLoading] = useState(false);
    // to keep track if its loading or not

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        // we going to attempt to send a req to whatever route it is that this form is repr
        // so we gonna try to login or register

        try {
            const res = await api.post(route, { username, password })
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                // when we send the req, if an error occurs the catch block comes in
                // if no error, we check if the method is login if it is, we get the access and refresh token
                // then we set these tokens
                navigate('/')
            }else{
                navigate('/login')
                // the idea is that, if it wasn't logged in , it must have been registered
                // and if registered, no tokens we need to set, in order to get the tokens we need to log in
                // with our registered accnt
                // if the method is not logged in, we assume the user is registering so after registration
                // the user is navigated to the login
            }
        } catch (error) {
            alert(error);

        }finally{
            setLoading(false);
        }


    }

    const name = method === 'login' ? 'Login' : 'Register'; 


  return (
    <form action="" onSubmit={handleSubmit} className='form-container'>
        <h1>
            {name}
        </h1>

        <input type="text"  className='form-input' 
        value={username} 
        onChange={(e)=> setUsername(e.target.value)} 
        placeholder='username'/>

        <input type="password"  className='form-input' 
        value={password} 
        onChange={(e)=> setPassword(e.target.value)} 
        placeholder='password'/>

        {/* apply the loading indicator here */}
        {loading && <LoadingIndicator/>}
        <button className='form-button' type='submit'>{name}</button>


    </form>
  )
}

export default Form;