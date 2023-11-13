import React, { useState } from 'react';
import { Header } from '../components/Header';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { Navigate } from 'react-router-dom';

function Login() { 
  const [cookies, setCookie] = useCookies(["user"]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  }

  const parseJwt = (token) => {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

  const loginHandler = async (e) => {
    e.preventDefault();
    try{
      const res = await axios({
        method: 'post',
        url: 'http://localhost:3001/login',
        data: {
          username: username,
          password: password
        }
      })
      const data = await parseJwt(res.data)
      setCookie("user", data, { path: "/" });
      setCookie("token", res.data);
      console.log(cookies.token)
    } catch(e){
      console.log(e)
    }

  }

  return (
      cookies.user ? (<Navigate to='/user'/>) : (
              <main>
              <Header/>
              <form>
                <label htmlFor=''>Username</label>
                <input type='text' onChange={handleUsernameChange}/>
                <label htmlFor=''>Password</label>
                <input type='password' onChange={handlePasswordChange}/>
                <button type='submit' onClick={loginHandler}>Login</button>
              </form>
            </main>
      )
  )
}

export default Login