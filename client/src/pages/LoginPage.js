import React, { useContext } from 'react';
import {useState} from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../UserContext';


function LoginPage() {
  const [username,setusername]=useState('');
  const [password,setpassword]=useState('');
  const [redirect, setRedirect] = useState(false);
  const {setUserInfo}=useContext(UserContext);


  function handleChangeU(event){
    setusername(event.target.value)
  }
  function handleChangeP(event){
    setpassword(event.target.value)
  }

  async function login(event){
    event.preventDefault();
    const response=await fetch('http://localhost:4000/login',{
      method:'POST',
      body:JSON.stringify({username,password}),
      headers:{'Content-Type': 'application/json'},
      credentials:'include'
    })
    try {
      const response = await fetch('http://localhost:4000/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
    
      if (response.ok) {
        const userInfo = await response.json();
        setUserInfo(userInfo);
        setRedirect(true);
      } else {
        const errorMessage = await response.text();
        alert(`Login failed: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      alert('Unable to connect to the server.');
    }    
  }

  if(redirect){
    return <Navigate to={'/'} />
  }

  return (
    <form className='login' onSubmit={login}>
      <h1>Login</h1>
      <input type="username" placeholder='username' onChange={handleChangeU} value={username}/>
      <input type="password" placeholder='password' onChange={handleChangeP} value={password}/>
      <button>Login</button>
    </form>
  )
}

export default LoginPage;