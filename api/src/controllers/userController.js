import User from "../Models/User.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";

export const createUser = async (req, res, next) => {
  const { email, firstName, lastName, password } = req.body;
  try {
    if ((!email | !firstName, !lastName, !password)) next(errorHandler(400, "All fields are required."));

    const existing = await User.findOne({ email });
    if (existing) next(errorHandler(409, "User already exists."));

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      firstName,
      lastName,
      password: hashedPassword,
    });

    return res.status(201).json({ message: "User has been created!" });
  } catch (error) {
    next(error)
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    if (!users) next(errorHandler(404, "No records found."));
    return res.status(200).send(users);
  } catch (error) {
    next(error)
  }
};
