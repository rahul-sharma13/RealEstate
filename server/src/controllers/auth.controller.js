import User from "../models/Users.model.js";
import bcryptjs from "bcryptjs";
import { ApiResponse } from "../utils/ApiResponse.js";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signUp = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({ username, email, password: hashedPassword });

  try {
    await newUser.save();
    return res
      .status(201)
      .json(new ApiResponse(200, newUser, "user is registered"));
  } catch (error) {
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });

    if (!validUser)
      return next(errorHandler(400, "User not found, please sign up first"));

    const validPassword = bcryptjs.compareSync(password, validUser.password);

    if (!validPassword) return next(errorHandler(401, "Wrong credentials"));

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

    const requiredUser = await User.findById(validUser._id).select("-password");

    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(new ApiResponse(200, requiredUser, "User signed in successfully."));
  } catch (error) {
    next(error);
  }
};

export const googleSignIn = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

      const resultUser = await User.findById(user._id).select("-password");

      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(new ApiResponse(200, resultUser, "User logged in using google"));

      // creating a new user if that user is not already signed in
    } else {
      // as password required is true in schema but there is no password created when we use google sign in so we first need to create a password

      const generatedPassword = Math.random().toString(36).slice(-8);

      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });

      await newUser.save();

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(
          new ApiResponse(200, newUser, "user created using google sign in")
        );
    }
  } catch (error) {
    next(error);
  }
};