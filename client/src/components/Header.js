import React, { useState, useEffect, useContext } from 'react';
import {Link} from "react-router-dom";
import { UserContext } from '../UserContext';


function Header() {
  //const {setUserInfo,userInfo}=useContext(UserContext);
  const { setUserInfo, userInfo } = useContext(UserContext);
  useEffect(() => {
    fetch('http://localhost:4000/profile', {
      credentials: 'include'
    })
    .then(response => response.json())
    .then(userInfo => {
      setUserInfo(userInfo);
    })
    .catch(err => console.error('Error fetching user profile:', err));
  }, [setUserInfo]);

  function logout() {
    fetch('http://localhost:4000/logout', {
      method: 'POST',
      credentials: 'include'
    })
    .then(response => {
      if (response.ok) {
        setUserInfo(null); 
        console.log('Logged out successfully');
      } else {
        console.error('Failed to log out');
      }
    })
    .catch(err => console.error('Logout error:', err));
  }

  const username=userInfo?.username;
  
  return (
    <header>
        <Link to='/' className="logo">My Blog</Link>
        <nav>
          {username && (
            <>
            <Link to='/create'>Create new post</Link>
            <a onClick={logout}>Logout</a>
            </>
          )}
          {!username && (
            <>
            <Link to='/login'>Login</Link>
            <Link to='/register'>Register</Link>
            </>
          )}
        </nav>
      </header>
  )
}

export default Header;