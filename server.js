const express = require('express');
require('dotenv/config');
const mongoose = require('mongoose');
const User = require('./schema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('db connect success');
  })
  .catch(e => console.log(e));

const app = express();
app.use(express.json());
app.use(cors());

const authorize = (req, res, next) => {
  console.log(req.headers)
  const token = req.headers.authorization.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (e) {
    return res.status(401).send('not authorized');
  }

  next();
}

app.get('/users/:id', authorize, async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  res.send(user);
});

app.post('/login', async (req, res) => {
  const user = await User.findOne({
    username: req.body.username
  });

  if (!user) {
    return res.status(400).send('Incorrect username or password!');
  }
  const result = bcrypt.compareSync(req.body.password, user.password);
  if (!result) {
    return res.status(400).send('Incorrect username or password!');
  }

  const token = jwt.sign({
    id: user._id,
    username: user.username,
  }, process.env.JWT_SECRET, { expiresIn: '24h' });

  return res.send(token);
});

app.post('/signup', async (req, res) => {
  if (await User.findOne({
    username: req.body.username
  })) {
    return res.send('Username already exist!');
  };

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(req.body.password, salt);


  const user = await User.create({
    username: req.body.username,
    password: hash,
    privateMsg: "Here is our secret code: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkaXNjb3VudENvZGUiOiJhNSZzNTJiQUFHdXNhdDQzUiIsInJhdGUiOiI3NSUiLCJpYXQiOjE1MTYyMzkwMjJ9.IfIwpRGBhEbsPI9idQ7mzf36L17pPKJwE6IPU3Gp4DA"
  });
  const token = jwt.sign({
    id: user._id,
    username: user.username,
  }, process.env.JWT_SECRET, { expiresIn: '24h' });

  res.send(token);
});

app.listen(3001, () => {
  console.log("App running");
});