const { Router } = require("express");
const z = require("zod");
const bcrypt = require("bcrypt");

const AdminRouter = Router();

AdminRouter.get("/", (req, res) => {
  res.send("Admin");
});

module.exports = {
  AdminRouter,
};
