import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Register = () => {
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

        try {
        const response = await axios.post(
            'http://localhost:8000/auth/register',
            userData // Pass the formData object directly
        );
        
        const data = await response.data

        if (data) {
            console.log(data);            
            navigate("/");
        } else {
            alert('Please check your username and password')
        }
        
        } catch (error) {
        console.error('Signup failed', error);
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
        type='submit'>Signup</button>
              
        <br />
        <a href='/' className='underline'>Already have account?</a>
      </form>

    </div>
  )
}

export default Register