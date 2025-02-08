const jwt = require("jsonwebtoken");
const { JWT_ADMIN_PASSWORD } = require("../config");

function AdminAuth(req, res, next) {
  const token = req.headers.token;
  const word = token.split(" ");
  const jwtToken = word[1];
  const decodedData = jwt.verify(jwtToken, JWT_ADMIN_PASSWORD);

  if (decodedData) {
    req.adminId = decodedData.id;
    next();
  } else {
    res.status(403).json({
      message: "Something went wrong",
    });
  }
}

module.exports = {
  AdminAuth,
};
