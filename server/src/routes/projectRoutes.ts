import express from "express";
import * as projectController from "../controllers/projectController";
import { authenticateToken } from "../util/authMiddleware";

const router = express.Router();

router.post(
  "/projects",
  authenticateToken,
  projectController.generateERDController
);
router.get(
  "/projects/:projectId",
  authenticateToken,
  projectController.getProjectController
);
router.patch(
  "/projects/",
  authenticateToken,
  projectController.updateERDController
);
router.get(
  "/projects",
  authenticateToken,
  projectController.getAllProjectsController
);

export default router;
