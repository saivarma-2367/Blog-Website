const express=require("express");
const cors=require("cors");
const { default: mongoose } = require("mongoose");
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
const User=require("./models/user");
const cookieParser=require("cookie-parser");

const app=express();
const jwt=require('jsonwebtoken');

const port=4000;
const secret='axbbfalfbgrbibvbejvbfxlvbxdlh';

app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());  
app.use(cookieParser());

mongoose.connect('mongodb+srv://saivarma:12345@cluster0.eu34b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

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

app.post('/login',async(req,res)=>{
  const {username,password}=req.body;
  const UserDoc=await User.findOne({username});
  const passOK=bcrypt.compareSync(password,UserDoc.password);
  if(passOK){
    jwt.sign({username,id:UserDoc._id},secret,{},(err,token)=>{
      if(err) throw err;
      res.cookie('token',token).json({
        id:UserDoc._id,
        username,
      });
      console.log("password verified.");
    })
  }
  else{
    res.status(400).json('Wrong Credentials.');
  }
})

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


app.listen(port,()=>{
  console.log(`server running on port ${port}`);
})
