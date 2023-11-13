import React, { useState } from 'react';
import axios from 'axios';
import { Header } from '../components/Header';
import { useCookies } from 'react-cookie';
import { Navigate } from 'react-router-dom';

function Signup() {
  const [cookies] = useCookies(["user"]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  }

  const signUpHandler = async(e) => {

    e.preventDefault()
    try{
      const result = await axios({
        method: 'post',
        url: 'http://localhost:3001/signup',
        data: {
          username: username,
          password: password
        }
      });
      console.log(result)
      return result;
    } catch(e){
      throw new Error(e)
    }
  }

  return (
    cookies.user ? (
      <Navigate to='/user'/>
    ):
    <main>
    <Header/>
    <form onSubmit={signUpHandler}>
      <label htmlFor=''>Username</label>
      <input type='text' onChange={handleUsernameChange}/>
      <label htmlFor=''>Password</label>
      <input type='password' onChange={handlePasswordChange}/>
      <button type='submit'>Sign Up</button>
    </form>
  </main>
  )
}

export default Signup