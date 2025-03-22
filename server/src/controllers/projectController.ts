import { Request, Response } from "express";
import * as erdService from "../services/erdService";
import { projectService } from "../services/projectService";

export const generateERDController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { message } = req.body;
    const { id } = req.params;

    // Validate input
    if (!message || typeof message !== "string") {
      res.status(400).json({
        error: "Invalid input. Message is required and must be a string.",
      });
      return;
    }

    // Generate the ERD using the service
    const { title, erdResponse, thread_id } = await erdService.generateERD(
      message
    );

    // Create a new project with the ERD response
    const project = await projectService.createProject(
      thread_id,
      title,
      id,
      erdResponse
    );

    // Return the response
    res.status(201).json({
      project,
    });
  } catch (error) {
    console.error("Error in ERD generation:", error);
    res.status(500).json({
      error: "Failed to generate ERD diagram",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const updateERDController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { message, thread_id } = req.body;
    const userId = req.params.id;

    if (!message || typeof message !== "string") {
      res.status(400).json({
        error: "Invalid input. Message is required and must be a string.",
      });
      return;
    }
    if (!thread_id) {
      res.status(400).json({
        error: "Thread ID is required",
      });
      return;
    }

    const { erdResponse } = await erdService.updateERD(message, thread_id);
    if (!erdResponse) {
      res.status(500).json({ error: "Failed to update ERD." });
      return;
    }

    const updatedProject = await projectService.updateProject(
      thread_id,
      erdResponse
    );

    if (!updatedProject) {
      res.status(404).json({ error: "Project not found." });
      return;
    }

    res.status(200).json({ project: updatedProject });
  } catch (error) {
    console.error("Error in ERD generation:", error);
    res.status(500).json({
      error: "Failed to generate ERD diagram",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getProjectController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id, projectId } = req.params;
    const project = await projectService.getProject(projectId);

    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve project",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getAllProjectsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const projects = await projectService.getAllProjects(id);
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve projects",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
