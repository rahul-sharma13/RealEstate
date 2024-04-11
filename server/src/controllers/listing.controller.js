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

  if (!listing) {
    return next(errorHandler(404, "listing not found!"));
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "you can only update your own listing"));
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(200, updatedListing, "listing is updated");
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(400, "listing not found"));
    }

    res.status(200).json(new ApiResponse(200, listing, "listing found"));
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    // getting all the required queries
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;

    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;

    // we want to search in both sale and rent condition
    if (type === undefined || type === "all") {
      type = { $in: ["sale", "rent"] };
    }

    const searchTerm = req.query.searchTerm || "";
    const sort = req.query.sort || "createdAt";
    const order = req.query.order || "desc";

    // getting the listing according to the queries
    // regex - searches for the input does not have to be a whole word. 'd' is typed so searches for everything with 'd'
    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res
      .status(200)
      .json(new ApiResponse(200, listings, "listings fetched"));
  } catch (error) {
    next(error);
  }
};

export const getAllListings = async (req, res, next) => {
  try {
    const listings = await Listing.find();
    res.status(200).json(new ApiResponse(200, listings, "all listings fetched"));
  } catch (error) {
    next(error);
  }
};