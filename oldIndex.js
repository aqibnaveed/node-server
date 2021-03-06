const express = require('express');
const bodyParser = require('body-parser');
const birds = require('./birds');
let cookieParser = require('cookie-parser');
const middleware = require('./my-middleware');

const mongoose = require('mongoose');

const app = express();
let router = express.Router();

const port = process.env.PORT || 5000;

app.set('view engine', 'pug');

app.get('/', (req, res) => {
  res.render('index', { title: 'Hey', message: 'Hello there!' });
});

// const NewPost = new mongoose.Schema({
//   author: ObjectId,
//   title: String,
//   body: String,
//   date: Date,
// });

// router.use((req, res, next) => {
//   console.log('router.use');
//   if (!req.headers['x-auth']) {
//     return next('router');
//   }
//   next();
// });

// router.get('/user/:id', (req, res) => {
//   console.log('router.get');
//   res.send('hello, user!');
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

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

const cookieValidator = (cookies) => {
  try {
    externallyValidateCookie(cookies.testCookie);
  } catch (err) {
    throw new Error('Invalid Cookies');
  }
};

const validateCookies = async (req, res, next) => {
  await cookieValidator(req.cookies);
};

// app.use(middleware({ option1: '1', option2: '2' }));

// app.use(cookieParser());
// app.use(validateCookies);

// app.use((err, req, res, next) => {
//   res.status(400).send(err.message);
// });

const myLogger = (req, res, next) => {
  console.log('LOGGED');
  next();
};

let requestTime = (req, res, next) => {
  req.requestTime = Date.now();
  next();
};

//app.use(requestTime);

app.get('/test', (req, res) => {
  let responseText = 'Hello World';
  responseText = responseText + ', Requested at: ' + req.requestTime;
  res.send(responseText);
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
