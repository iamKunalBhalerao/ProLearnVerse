const { Router } = require("express");
const z = require("zod");
const bcrypt = require("bcrypt");
const { UserModel } = require("../db");

const UserRouter = Router();

UserRouter.post("/", async (req, res) => {
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

  const parseUserDataWithSuccess = requireBody.safeParse(req.body);

  if (!parseUserDataWithSuccess.success) {
    res.status(403).json({
      message: "Invalid email or password",
      error: parseUserDataWithSuccess.error,
    });
  }

  const hashedPassword = await bcrypt.hash(password, 5);

  try {
    const createUser = await UserModel.create({
      email: email,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
    });
    res.status(200).json({
      message: "You are Signed Up 👏",
      createUser,
    });
  } catch (e) {
    es.status(403).json({
      message: "User Alredy Exists !!!",
    });
  }
});

module.exports = {
  UserRouter,
};
