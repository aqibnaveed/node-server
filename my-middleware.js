const middleware = (options) => {
  return (req, res, next) => {
    console.log('middleware implementation');
    next();
  };
};

module.exports = middleware;
