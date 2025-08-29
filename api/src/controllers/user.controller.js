import User from "../Models/User.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";

export const createUser = async (req, res, next) => {
  const { email, fullName, password } = req.body;
  try {
    if ((!email | !fullName, !password)) next(errorHandler(400, "All fields are required."));

    const existing = await User.findOne({ email });
    if (existing) next(errorHandler(409, "Account with that email already exists."));

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      fullName,
      password: hashedPassword,
    });

    return res.status(201).json({ message: "User has been created!" });
  } catch (error) {
    next(error)
  }
};

export const updateUserDetails = async (req, res, next) => {
  const { userId } = req.params;
  const { fullName } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return next(errorHandler(404, "User not found."));
    if (!fullName) return next(errorHandler(400, "Full name is required."));
    user.fullName = fullName;
    await user.save();
    return res.status(200).json({ message: "User full name updated successfully!" });
  } catch (error) {
    next(error);
  }
}

export const updateUserPassword = async (req, res, next) => {
  const { userId } = req.params;
  const { newPassword } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return next(errorHandler(404, "User not found."));
    if (!newPassword) return next(errorHandler(400, "New password is required."));
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    return res.status(200).json({ message: "Password updated successfully!" });
  } catch (error) {
    next(error);
  }
}

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    if (!users) next(errorHandler(404, "No records found."));
    return res.status(200).send(users);
  } catch (error) {
    next(error)
  }
};

export const deleteUser = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) return next(errorHandler(404, "User not found."));
    return res.status(200).json({ message: "User has been deleted." });
  } catch (error) {
    next(error);
  }
}