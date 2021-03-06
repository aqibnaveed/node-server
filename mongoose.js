const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// EDIT: As of this edit, Mongoose is now at v5.4.13. Per their docs, these are
// the fixes for the deprecation warnings...

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

// Replace update() with updateOne(), updateMany(), or replaceOne()
// Replace remove() with deleteOne() or deleteMany().
// Replace count() with countDocuments(), unless you want to count how many
// documents are in the whole collection (no filter). In the latter case, use estimatedDocumentCount().

const Person = new Schema({
  name: {
    first: String,
    last: String,
  },
  email: {
    type: String,
    required: true,
    index: {
      unique: true,
      sparse: true,
    },
  },
  password: {
    type: String,
    required: true,
  },
});

const Post = new Schema({
  message: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
});

const PersonModel = mongoose.model('PersonModel', Person);
const PostModel = mongoose.model('PostModel', Post);

try {
  mongoose.connect('mongodb://localhost:27017/myapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
} catch (error) {
  console.log(error);
}

//update();

//PersonModel.findOne({ email: 'jasim@gmail.com' });

// const NewPost = new mongoose.Schema({
//   author: ObjectId,
//   title: String,
//   body: String,
//   date: Date,
// });

const returnHash = (err, hash) => {
  console.log('Hash Password:adssadasd', hash);
  result = hash;
};

const generateHashPassword = (password) => {
  console.log('geneerate has started');
  // const hash = bcrypt.hashSync(password, 8);

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  console.log('hash in isde functiuon', hash);
  return hash;
};

// User Sign Up
const create = async (fname, lname, emailId, password) => {
  console.log('main hoon don');
  const hashPassword = generateHashPassword(password);
  console.log('aqib');

  // let hashPassword;

  console.log('Hash Password before if, ', hashPassword);

  if (hashPassword) {
    console.log('inside if hash');
    console.log('hash password: ', hashPassword);
    const data = await PersonModel.create({
      name: { first: fname, last: lname },
      email: emailId,
      password: hashPassword,
    });
    if (data) {
      console.log('200');
      return 200;
    } else {
      console.log('11000');
      return 11000;
    }
  }
  // return 11000;
};

const checkHashPassword = (requestPassword, dbPassword) => {
  const valid = bcrypt.compareSync(requestPassword, dbPassword);

  //  bcrypt.compare(requestPassword, dbPassword);
  return valid ? true : false;
};

// Login
const login = async (email, password) => {
  let finalResult;
  console.log('Login method starts');

  try {
    const data = await PersonModel.find(
      {
        email: email,
      },
      async (error, result) => {
        if (error)
          finalResult = {
            error: 'There is an error in Fetching full data from server.',
          };

        console.log('email exist');

        const passwordStatus = checkHashPassword(password, result[0].password);

        if (passwordStatus) {
          console.log('Password Status:', true);
          finalResult = result;
        } else {
          console.log('Password Status:', false);
        }
      }
    );
  } catch (err) {
    console.log('ERROR in login try method');
  }

  return finalResult;
};

// Read All Users (no usage)
const readAll = async () => {
  let finalResult = 'return';
  await PersonModel.find(function (error, result) {
    if (error)
      finalResult = {
        error: 'There is an error in Fetching full data from server.',
      };

    finalResult = result;
  });
  return finalResult;
};

// Read All Posts
const readAllPosts = async () => {
  let finalResult = 'return';
  await PostModel.find(function (error, result) {
    if (error)
      finalResult = {
        error: 'There is an error in Fetching full data from server.',
      };

    finalResult = result;
  });
  return finalResult;
};

// Add a new Post
const addPost = async (message, author, date) => {
  console.log('main hoon don');
  const data = await PostModel.create({
    message: message,
    author: author,
    date: date,
  });
  if (data) {
    console.log('200');
    return 200;
  } else {
    console.log('11000');
    return 11000;
  }
};

const readOne = (email) => {
  PersonModel.find({ email: email }, function (error, result) {
    if (error)
      return console.log(
        'There is an error in Fetching full data from server.'
      );
    console.log('result: ' + result);
  });
};

const deletePost = (post) => {
  // PostModel.findOneAndDelete({});

  PostModel.deleteOne(
    {
      _id: post._id,
    },
    function (err) {
      if (err) return console.log('There is an error in Deletion.');
      console.log('deleted!');

      readAll();
    }
  );
};

const delete_ = (email) => {
  PersonModel.deleteOne(
    {
      email: email,
    },
    function (err) {
      if (err) return console.log('There is an error in Deletion.');
      console.log('deleted!');

      readAll();
    }
  );
};

const update = async (email, fname, lname) => {
  console.log('update called');
  const res = await PersonModel.updateOne(
    { email: email },
    { name: { first: fname, last: lname } }
  );

  if (await res) {
    console.log('Number of documents matched: ' + res.n);
    console.log('Number of documents modified: ' + res.nModified);

    readAll();
  }
};

module.exports = {
  create,
  delete_,
  deletePost,
  login,
  readAll,
  readAllPosts,
  readOne,
  update,
  addPost,
};
