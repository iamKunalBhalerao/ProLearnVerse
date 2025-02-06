const { Router } = require("express");
const z = require("zod");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { AdminAuth } = require("../auth/AdminAuth");
const { AdminModel } = require("../db");
const { JWT_ADMIN_PASSWORD } = require("../config");

const AdminRouter = Router();

AdminRouter.get("/signup", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  const requireBody = z.object({
    email: z.string().min(3).max(100).email(),
    firstName: z.string().min(3).max(100),
    lastName: z.string().min(3).max(100),
    password: z
      .string()
      .min(3)
      .max(100)
      .refine((value) => /[A-Z]/.test(value), {
        message: "Password must contain at least one uppercase letter",
      })
      .refine((value) => /[a-z]/.test(value), {
        message: "Password must contain at least one lowercase letter",
      })
      .refine((value) => /\d/.test(value), {
        message: "Password must contain at least one digit",
      })
      .refine((value) => /[!@#$%^&*(),.?":{}|<>]/.test(value), {
        message: "Password must contain at least one special character",
      }),
  });

  const parseAdminBodyWithSuccess = requireBody.safeParse(req.body);

  if (!parseAdminBodyWithSuccess.success) {
    res.status(403).json({
      message: "Invalid Email or Password",
      error: parseAdminBodyWithSuccess.error,
    });
  }

  const hashedAdminPassword = await bcrypt.hash(password, 5);

  if (hashedAdminPassword) {
    const admin = await AdminModel.create({
      email: email,
      password: hashedAdminPassword,
      firstName: firstName,
      lastName: lastName,
    });
    res.status(200).json({
      message: "You are signed Up",
      admin: admin,
    });
  }
});
AdminRouter.get("/signin", async (req, res) => {
  const { email, password } = req.body;

  const admin = await AdminModel.findOne({
    email: email,
  });

  if (!findEmail) {
    res.status(403).json({
      message: "User Not Found",
    });
  }

  const compareAdminPassword = bcrypt.compare(password, admin.password);

  if (compareAdminPassword) {
    const token = jwt.sign({ id: admin._id }, JWT_ADMIN_PASSWORD);
    res.status(200).json({
      token,
    });
  } else {
    res.status(403).json({
      message: "Invalid Credentials",
      error: compareAdminPassword.error,
    });
  }
});
AdminRouter.get("/create-course", AdminAuth, (req, res) => {});
AdminRouter.get("/update-course", AdminAuth, (req, res) => {});
AdminRouter.get("/delete-course", AdminAuth, (req, res) => {});
AdminRouter.get("/", AdminAuth, (req, res) => {});

module.exports = {
  AdminRouter,
};
