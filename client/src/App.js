import { Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Post from "./components/Post";
import Layout from './components/Layout';
import IndexPage from './pages/IndexPage';
import LoginPage from "./pages/LoginPage";
import RegisterPage from './pages/RegisterPage';
import CreatePost from './pages/CreatePost';
import PostPage from './pages/PostPage';
import EditPost from './pages/EditPost';

function App() {
  return (
    <Routes>
      <Route to='/' element={<Layout />} >
        <Route index element={<IndexPage />}/>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/create' element={<CreatePost />} />
        <Route path='/post/:id' element={<PostPage />} />
        <Route path='/edit/:id' element={<EditPost />} />
      </Route>
    </Routes>
  );
}

export default App;
