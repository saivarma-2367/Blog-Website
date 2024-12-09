import React, { useState,useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import Editor from '../components/Editor';

function EditPost() {
  const [title,setTitle]=useState('');
  const [summary,setSummary]=useState('');
  const [content,setContent]=useState('');
  const [files,setFiles]=useState('');
  const [redirect,setRedirect]=useState(false);
  const {id} =useParams();

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetch(`http://localhost:4000/post/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch post data');
        }
        const postInfo = await response.json();
        console.log('Fetched Post:', postInfo);
        setTitle(postInfo.title);
        setSummary(postInfo.summary);
        setContent(postInfo.content);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    }
    fetchPost();
  }, [id]);

  async function updatePost(ev){
    ev.preventDefault();
    const data = new FormData();
    data.set('title',title);
    data.set('summary',summary);
    data.set('content',content);
    data.set('id',id);
    if (files && files[0]) {
      data.set('file', files[0]);
    }
    
    await fetch(`http://localhost:4000/post/${id}`, {
      method: 'PUT',
      body: data,
      credentials: 'include', 
    });
       
    setRedirect(true);
  }
  if(redirect){
    return <Navigate to={'/post/'+id} />
  }
  return (
    <div>
      <form onSubmit={updatePost}>
        <input type="title" placeholder="Title" value={title} onChange={ev =>setTitle(ev.target.value)}/> 
        <input type="summary" placeholder="Summary" value={summary} onChange={ev => setSummary(ev.target.value)}/> 
        <input type="file" name="file" onChange={ev => setFiles(ev.target.files)} />
        <Editor content={content} onChange={setContent} />
        <button style={{marginTop:"5px"}}>updatePost</button>
      </form>
    </div>
  )
}

export default EditPost;