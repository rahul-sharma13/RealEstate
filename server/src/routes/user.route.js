import { Router } from "express";
import { deleteUser, getOwner, getUserListings, updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = Router();

router.route("/update/:id").post(verifyToken,updateUser)
router.route("/delete/:id").delete(verifyToken, deleteUser)
router.route("/listings/:id").get(verifyToken,getUserListings)
router.route("/:id").get(verifyToken, getOwner)

export default router;