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

    if (!user) return next(errorHandler(404, "User does not exist."));

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) return next(errorHandler(401, "Invalid password."));

    const { password: hashedPassword, ...rest } = user._doc;

    const access_token = jwt.sign(rest, process.env.JWT_SECRET, {
      expiresIn: "4h",
    });

    res.status(200).json({ access_token });
  } catch (error) {
    next(error);
  }
};

export const authGoogleLogin = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const { password: hashedPassword, ...rest } = user._doc;
      const access_token = jwt.sign(rest, process.env.JWT_SECRET, {
        expiresIn: "4h",
      });
      rest.status(200).json({access_token});
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);
      const newUser = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword,
        profilePicture: req.body.profilePicture
      });
      const {password: hashedPassword2, ...rest} = newUser._doc;
      const access_token = jwt.sign(rest, process.env.JWT_SECRET, {
      expiresIn: "4h",
    });
    res.status(200).json({access_token});
    }
  } catch (error) {
    next(error);
  }
};
