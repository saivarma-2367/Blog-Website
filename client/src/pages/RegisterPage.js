import React from 'react';
import { useState } from 'react';

function RegisterPage() {
  const [username,setusername]=useState('');
  const [password,setpassword]=useState('');

  function handleChangeU(event){
    setusername(event.target.value)
  }
  function handleChangeP(event){
    setpassword(event.target.value)
  }
  async function register(event){
    event.preventDefault();
      const response=await fetch('http://localhost:4000/register',{
        method:'POST',
        body:JSON.stringify({username,password}),
        headers:{'Content-Type': 'application/json'},
      })
      if(response.status===200){
        alert('registration successful.')
      }else{
        alert('registration failed.')
      }
  }

  return (
    <form className='register' onSubmit={register}>
      <h1>Register</h1>
      <input type="username" placeholder='username' onChange={handleChangeU} value={username}/>
      <input type="password" placeholder='password' onChange={handleChangeP} value={password}/>
      <button>Register</button>
    </form>
  )
}

export default RegisterPage;