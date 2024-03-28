import express from "express";
import { googleSignIn, signIn, signOut, signUp } from "../controllers/auth.controller.js";

const router = express.Router();

// router.post("/signup",signUp)
router.route("/signup").post(signUp);
router.route("/signin").post(signIn);
router.route("/google").post(googleSignIn);
router.route("/signout").get(signOut);

export default router;