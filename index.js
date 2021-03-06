// sudo lsof -i :27017
// sudo kill -9 <pid>
// sudo mongod
// mongo

const express = require('express');
const bodyParser = require('body-parser');
const birds = require('./birds');
let cookieParser = require('cookie-parser');
const middleware = require('./my-middleware');
const jwt = require('jsonwebtoken');

const {
  create,
  delete_,
  login,
  readAll,
  readOne,
  update,
  readAllPosts,
  addPost,
  deletePost,
} = require('./mongoose');

const app = express();
let router = express.Router();

const port = process.env.PORT || 5000;
const accessTokenSecret = 'youraccesstokensecret';

//app.set('view engine', 'pug');

// app.get('/', (req, res) => {
//   res.render('index', { title: 'Hey', message: 'Hello there!' });
// });

// app.use('/admin', router, (req, res) => {
//   console.log('last msg');
//   res.send('401');
//   // res.sendStatus(401);
// });

// router.use(
//   '/user/:id',
//   (req, res, next) => {
//     console.log('Request URL:', req.originalUrl);
//     next();
//   },
//   (req, res, next) => {
//     console.log('Request Type: ' + req.method);
//     next();
//   }
// );

// app.use('/', router);

let requestTime = (req, res, next) => {
  req.requestTime = Date.now();
  next();
};

//app.use(requestTime);

// CRUD
// create -> (one)
// read -> (all, one)
// update
// delete -> (one)

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post(`/sign-up`, async (req, res) => {
  console.log('req body: ');
  console.log(req.body);

  try {
    const statusCode = await create(
      req.body.fname,
      req.body.lname,
      req.body.email,
      req.body.password
    );
    console.log('abc');

    if (statusCode === 200) {
      console.log('status code found');
      console.log(statusCode);
      res.sendStatus(200);
    } else {
      console.log('status code NOT found');
      console.log('Status Code', statusCode);
      res.sendStatus(500);
    }
  } catch (err) {
    console.log('Error in insertion, might be email is duplicate');
    res.sendStatus(409);
  }
});

const authenticateJWT = (req, res, next) => {
  console.log('authenticatE: ');
  console.log(req);
  const authHeader = req.headers.authorization;

  console.log('auth header: ', authHeader);

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, accessTokenSecret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = user;

      console.log('JWT verify');
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

app.post('/login', async (req, res) => {
  console.log('login', req.body);
  const { email, password } = req.body;

  try {
    const user = (await login(email, password))[0];
    console.log(user);

    if (user) {
      //  res.send(user[0]);
      const accessToken = jwt.sign(
        {
          name: user.name.last + ' ' + user.name.first,
          email: user.email,
        },
        accessTokenSecret
      );

      res.json({ user, accessToken });

      // const refreshToken = jwt.sign(
      //   { username: user.username, role: user.role },
      //   refreshTokenSecret
      // );

      // refreshTokens.push(refreshToken);

      // res.json({ accessToken, refreshToken });
    } else {
      res.send('Username or password incorrect');
    }
  } catch (err) {
    console.log('error im try server/index.js');
  }
});

app.post(`/add-post`, authenticateJWT, async (req, res) => {
  console.log('Add Post - Req body: ');
  console.log(req.body);

  try {
    const statusCode = await addPost(
      req.body.message,
      req.body.author,
      req.body.date
    );
    console.log('ADD NEW POST - after the request');

    if (statusCode === 200) {
      console.log('status code found');
      console.log(statusCode);
      res.sendStatus(200);
    } else {
      console.log('status code NOT found');
      console.log(statusCode);
      res.sendStatus(500);
    }
  } catch (err) {
    console.log('Duplicate');
    res.sendStatus(409);
  }
});

app.post(`/post/delete`, (req, res) => {
  console.log('params: ');
  console.log(req.params);

  deletePost(req.params.postId);

  res.send('delete post method');
});

// app.get(`/delete/email=:email`, (req, res) => {
//   console.log('params: ');
//   console.log(req.url);

//   delete_(req.params.email);

//   res.send('delete method');
// });

app.get(`/delete/email=:email`, (req, res) => {
  console.log('params: ');
  console.log(req.url);

  delete_(req.params.email);

  res.send('delete method');
});

app.post(`/read/email=:email`, (req, res) => {
  console.log('params: ');
  console.log(req.url);

  readOne(req.params.email);

  res.send('read one method');
});

app.get(`/posts/read-all`, authenticateJWT, async (req, res) => {
  console.log('read-all posts:');
  try {
    const resultData = await readAllPosts();

    // console.log('result');
    // console.log(resultData);

    res.send(resultData);
  } catch (err) {
    console.log('error in read all posts.');
  }
});

app.get(`/read-all/`, async (req, res) => {
  console.log('read-all');
  try {
    const resultData = await readAll();

    // console.log('result');
    // console.log(resultData);

    res.send(resultData);
  } catch (err) {
    console.log('error in read all');
  }
});

app.get(`/update/email=:email-fname=:fname-lname=:lname`, (req, res) => {
  console.log('params: ');
  console.log(req.url);

  update(req.params.email, req.params.fname, req.params.lname);

  res.send('update method');
});

app.get('/list/:country.:city?', (req, res) => {
  res.send(req.params);
});

app.get('/api/hello', (req, res) => {
  res.send('Hello From Expr ');
});

const cb0 = (req, res, next) => {
  console.log('cb0');
  next();
};

const cb1 = (req, res, next) => {
  console.log('cb1');
  next();
};

app
  .route('/test1')
  .get((req, res) => {
    res.send('test get');
  })
  .post((req, res) => {
    res.send('Add a book');
  })
  .put((req, res) => {
    res.send('updare pictures');
  });

app.get(
  '/example/c',
  [cb0, cb1],
  (req, res, next) => {
    console.log('response will be sent by next function...');
    next();
  },
  (req, res) => {
    res.send('Hello from Server');
  }
);

app.get(
  '/api/about',
  (req, res, next) => {
    console.log('about route 1');
    next();
    //res.send('About page');
  },
  (req, res) => {
    console.log('about route 2');

    res.send('About page');
  }
);

app.post('/api/world', (req, res) => {
  console.log(req.body);
  res.send(
    `I received your POST request. This is what you sent me: ${req.body.post}`
  );
});

app.listen(port, () => console.log(`Listening on port ${port}`));

// "email": "/??\"*5",
// "email": "A? MI s I'm i ",
