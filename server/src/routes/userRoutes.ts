import express from "express";
import * as userController from "../controllers/userController";
import { authenticateToken } from "../util/authMiddleware";

const router = express.Router();

router.post("/users/", userController.createUser);
router.post("/users/login", userController.loginUser);
router.get("/users/", authenticateToken, userController.getUserDetails);

export default router;
