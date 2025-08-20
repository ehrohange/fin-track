import User from "../Models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { errorHandler } from "../utils/error.js";

dotenv.config();

export const authLogin = async (req, res, next) => {
    const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) next(errorHandler(404, "User does not exist."));

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) next(errorHandler(400, "Invalid password."))

    const payload = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "4h",
    });

    res.status(200).json({ access_token });
  } catch (error) {
    next(error);
  }
}