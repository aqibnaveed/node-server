const cookieValidator = (cookies) => {
  try {
    externallyValidateCookie(cookies.testCookie);
  } catch (err) {
    throw new Error('Invalid Cookies');
  }
};
