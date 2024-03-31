import Listing from "../models/Listing.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) return next(errorHandler(404, "listing not found"));

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "you can only delete your listing"));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json(new ApiResponse(200, {}, "listing deleted successfully"));
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if(!listing){
    return next(errorHandler(404,"listing not found!"));
  }

  if(req.user.id !== listing.userRef){
    return next(errorHandler(401,'you can only update your own listing'));
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new : true}
    );

    res.status(200).json(200,updatedListing,"listing is updated");
  } catch (error) {
    next(error)
  }
};

export const getListing = async (req,res,next) => {
  try {
  const listing = await Listing.findById(req.params.id);

  if(!listing){
    return next(errorHandler(400,"listing not found"));
  }

  res.status(200).json(new ApiResponse(200,listing,"listing found"));
  } catch (error) {
    next(error)
  }
}