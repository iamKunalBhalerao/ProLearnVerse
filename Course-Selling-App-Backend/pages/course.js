const { Router } = require("express");
const z = require("zod");
const bcrypt = require("bcrypt");

const CourseRouter = Router();

CourseRouter.get("/", (req, res) => {
  res.send("Course");
});

module.exports = {
  CourseRouter,
};
