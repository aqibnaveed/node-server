const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

const accessTokenSecret = 'youraccesstokensecret';

const refreshTokenSecret = 'yourrefreshtokensecrethere';
const refreshTokens = [];

app.listen(3000, () => {
  console.log('Authentication service started on port 3000');
});

const users = [
  {
    username: 'aqib',
    password: '123admin',
    role: 'admin',
  },
  {
    username: 'jasim',
    password: '123member',
    role: 'member',
  },
];

app.post('/login', (req, res) => {
  console.log('login', req.body);
  const { username, password } = req.body;

  const user = users.find((u) => {
    return u.username === username && u.password === password;
  });
  console.log('user find', user);

  if (user) {
    const accessToken = jwt.sign(
      { username: user.username, role: user.role },
      accessTokenSecret,
      { expiresIn: '20m' }
    );

    const refreshToken = jwt.sign(
      { username: user.username, role: user.role },
      refreshTokenSecret
    );

    refreshTokens.push(refreshToken);

    res.json({ accessToken, refreshToken });
  } else {
    res.send('Username or password incorrect');
  }
});

app.post('/token', (req, res) => {
  const { token } = req.body;
  console.log('token: ', req.body);

  if (!token) {
    return res.sendStatus(401);
  }

  if (!refreshTokens.includes(token)) {
    return res.sendStatus(403);
  }

  jwt.verify(token, refreshTokenSecret, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    const accessToken = jwt.sign(
      { username: user.username, role: user.role },
      accessTokenSecret,
      { expiresIn: '20m' }
    );

    res.json({ accessToken });
  });
});

app.post('/logout', (res, req) => {
  const { token } = req.body;
  refreshTokens = refreshTokens.filter((token) => t !== token);

  res.send('Logout successful');
});

// {
//   "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFxaWIiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2MTMwMzk0NjksImV4cCI6MTYxMzA0MDY2OX0.4Z3VJ-4M3iMBM9vOoOxJpcTSEbt2pBi0ELXR2I84Bzs",
//   "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFxaWIiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2MTMwMzk0Njl9.NL0XD5djpE2CVrsD3xMhxOTkrL9-infQfRQisgrfDG4"
// }
