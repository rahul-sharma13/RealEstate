import { Router } from "express";
import { updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = Router();

router.route("/update/:id").post(verifyToken,updateUser)

export default router;