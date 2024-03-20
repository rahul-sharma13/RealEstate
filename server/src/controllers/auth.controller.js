import User from "../models/Users.model.js";
import bcryptjs from "bcryptjs";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const signUp = async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password,10);

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User already exists");
  }

  const newUser = new User({ username, email, password : hashedPassword });

  await newUser.save();

  return res
    .status(201)
    .json(new ApiResponse(200, newUser, "user is registered"));
};
