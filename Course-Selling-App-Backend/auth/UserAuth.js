const express = require("express");
const jwt = require("jsonwebtoken");
const { JWT_USER_PASSWORD } = require("../config");

function UserAuth(req, res, next) {
  const token = req.headers.token;
  const decodedData = jwt.verify(token, JWT_USER_PASSWORD);

  if (decodedData) {
    req.userId = decodedData.id;
    next();
  } else {
    res.status(403).json({
      message: "Something went wrong",
    });
  }
}

module.exports = {
  UserAuth,
};
