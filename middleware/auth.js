const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
  const token = req.cookies.auth;
  
  if (!token) return res.redirect("http://" + req.headers.host);

  try {
    const decoded = jwt.verify(token, "randomString");
    req.user = decoded.user;
    next();
  } catch (e) {
    console.error(e);
    res.redirect("http://" + req.headers.host);
  }
};
