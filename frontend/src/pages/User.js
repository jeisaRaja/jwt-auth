import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { Navigate } from 'react-router-dom';


export const User = () => {

  const [cookies] = useCookies(['user','token']);
  const [privateMsg, setprivateMsg] = useState('');

  const getSecret = async() => {
    try{
      const url = `http://localhost:3001/users/${cookies.user.id}`;
      const res = await axios({
        method: 'get',
        url: url,
        headers: {
          Authorization: `Bearer ${cookies.token}`
        }
      });
      setprivateMsg(res.data.privateMsg)
    } catch(e){
      console.log(e);
    }
  }

  useEffect(()=>{
    getSecret();
  })


  return (
    cookies.user ? (
      <main>
        <h1>This is private</h1>
        <p className='centerDiv'>{privateMsg}</p>
      </main>
    ) : (
      <Navigate to='/login'/>
    )
  )
}
