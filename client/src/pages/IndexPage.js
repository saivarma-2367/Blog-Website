import React, { useEffect, useState } from 'react';
import Post from '../components/Post';

function IndexPage() {
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    fetch('http://localhost:4000/post')
      .then(response => response.json())
      .then(posts => {
        console.log(posts); // Debug: Check if posts are being fetched
        setPosts(posts);
      })
      .catch(err => console.error('Error fetching posts:', err)); // Debug errors
  }, []);
  
  return (
    <div>
      {posts.length > 0 ? (
        posts.map(post => <Post key={post._id} {...post} />)
      ) : (
        <p>No posts available</p>
      )}
    </div>
  );
}

export default IndexPage;
