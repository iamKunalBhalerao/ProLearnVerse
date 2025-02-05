const { Router } = require("express");
const z = require("zod");
const bcrypt = require("bcrypt");

const UserRouter = Router();

UserRouter.get("/", (req, res) => {
  res.send("Course");
});

module.exports = {
  UserRouter,
};
