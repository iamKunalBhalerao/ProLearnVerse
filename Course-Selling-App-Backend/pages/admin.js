const { Router } = require("express");
const z = require("zod");
const bcrypt = require("bcrypt");

const AdminRouter = Router();

AdminRouter.get("/signup", (req, res) => {});
AdminRouter.get("/signin", (req, res) => {});
AdminRouter.get("/create-course", (req, res) => {});
AdminRouter.get("/update-course", (req, res) => {});
AdminRouter.get("/delete-course", (req, res) => {});
AdminRouter.get("/", (req, res) => {});

module.exports = {
  AdminRouter,
};
