import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    username: "",
    password: "",
  })

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // login api call
  const handleLogin = async (e) => {
    e.preventDefault();

    console.log("login successful", userData);

    try {
      const response = await axios.post(
        'http://localhost:8000/auth/login',
        userData // Pass the formData object directly
      );
    
      const data = await response.data

      if (data) {
        console.log(data);
        
        sessionStorage.setItem('token', data.token)
        sessionStorage.setItem('id', data.data._id)
        sessionStorage.setItem('username', data.data.username)
        
        navigate("/chat");
      } else {
        alert('Please check your username and password')
      }
    
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <div align='center' className='p-12'>
      
      <div className='font-bold text-3xl'>Welcome! Let's Chat Together!!</div>
      
      <form className='m-12 p-12'>
        <input 
        name="username"
        label="Username"
        type='text'
        value={userData.username}
        onChange={handleInputChange}
        className='m-5 p-3 bg-black text-white border rounded-xl md:w-1/3 w-[200px]'
        placeholder='username' />
        
        <br />
        
        <input 
        name="password"
        label="Password"
        type='password'
        value={userData.password}
        onChange={handleInputChange}
        className='m-5 p-3 bg-black text-white border rounded-xl md:w-1/3 w-[200px]'
        placeholder='password' />
        
        <br />
        
        <button 
        onClick={handleLogin}
        className='m-5 p-3 bg-white text-black rounded-xl md:w-1/3 w-[200px]'
        type='submit'>Login</button>
      </form>

    </div>
  )
}

export default Login