const express=require("express");
const cors=require("cors");
const { default: mongoose } = require("mongoose");
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
const User = require('./models/user');
const Post=require("./post");
const cookieParser=require("cookie-parser");
const multer  = require('multer');
const uploadMiddleWare = multer({ dest: 'uploads/' });
const fs=require('fs');

const app=express();
const jwt=require('jsonwebtoken');

const port=4000;
const secret='axbbfalfbgrbibvbejvbfxlvbxdlh';

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());  
app.use(cookieParser());
app.use('/uploads',express.static(__dirname + '/uploads'));

mongoose.connect('mongodb+srv://saivarma:12345@cluster0.eu34b.mongodb.net/?retryWrites=true&w=majority')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));


app.post('/register',async(req,res)=>{
  const { username, password } = req.body;
  try{
   const UserDoc=await User.create({username,password:bcrypt.hashSync(password, salt)});
  console.log(UserDoc);
  res.json(UserDoc); 
  }catch(e){
    res.status(400).json(e);
  }
})

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const UserDoc = await User.findOne({ username });
    if (!UserDoc) {
      return res.status(400).json('User not found.');
    }
    const passOK = bcrypt.compareSync(password, UserDoc.password);
    if (passOK) {
      jwt.sign({ username, id: UserDoc._id }, secret, {}, (err, token) => {
        if (err) throw err;
        res.cookie('token', token, { httpOnly: true }).json({
          id: UserDoc._id,
          username,
        });
      });
    } else {
      res.status(400).json('Wrong Credentials.');
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json('Internal Server Error.');
  }
});


app.get('/profile', (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) throw err;
    res.json(info); 
  });
});


app.post('/logout', (req, res) => {
  res
    .cookie('token', '', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax', 
      expires: new Date(0), 
    })
    .json({ message: 'Logged out successfully' });
});

app.post('/post', uploadMiddleWare.single('file'), async (req, res) => {
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);

    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) {
        console.error('JWT verification failed:', err);
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { title, summary, content } = req.body;
      try {
        const postDoc = await Post.create({
          title,
          summary,
          content,
          cover: newPath,
          author: info.id,
        });
        res.json(postDoc); 
      } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Error creating post' });
      }
    });
  } else {
    res.status(400).json({ message: 'No file uploaded' });
  }
});

app.put('/post/:id', uploadMiddleWare.single('file'), async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    newPath = path + '.' + ext;
    fs.renameSync(path, newPath);
  }

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { id, title, summary, content } = req.body;

    try {
      const postDoc = await Post.findById(id);
      if (!postDoc) {
        return res.status(404).json({ message: 'Post not found' });
      }

      const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
      if (!isAuthor) {
        return res.status(403).json({ message: 'You are not the author' });
      }

      postDoc.set({
        title,
        summary,
        content,
        cover: newPath ? newPath : postDoc.cover,
      });

      await postDoc.save();
      res.json({ message: 'Post updated successfully' });
    } catch (error) {
      console.error('Error updating post:', error);
      res.status(500).json({ message: 'Error updating post' });
    }
  });
});



app.get('/post', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', ['username'])
      .sort({ createdAt: -1 })
      .limit(20)
      .exec();
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Error fetching posts' });
  }
});

app.get('/post/:id', async (req, res) => {
  const postId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ message: 'Invalid post ID' });
  }

  try {
    const postDoc = await Post.findById(postId).populate('author', ['username']);
    res.json(postDoc);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ message: 'Error fetching post' });
  }
});


app.listen(port,()=>{
  console.log(`server running on port ${port}`);
})
