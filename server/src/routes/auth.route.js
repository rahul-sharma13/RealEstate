import express from "express";
import { googleSignIn, signIn, signUp } from "../controllers/auth.controller.js";

const router = express.Router();

// router.post("/signup",signUp)
router.route("/signup").post(signUp);
router.route("/signin").post(signIn);
router.route("/google").post(googleSignIn);

export default router;