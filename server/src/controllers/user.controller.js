import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import User from "../models/Users.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "you can only change your account"));

  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        // not every field might be updated so we use set to ignore the fields which are not changed
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc; // to not send the password in the response

    return res
      .status(200)
      .json(new ApiResponse(201, rest, "user has been updated"));
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "you can delete your account only"));

  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json(new ApiResponse(200, {}, "user deleted successfully"));
  } catch (error) {
    next(error);
  }
};