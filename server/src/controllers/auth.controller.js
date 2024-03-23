import User from "../models/Users.model.js";
import bcryptjs from "bcryptjs";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const signUp = async (req, res,next) => {
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
