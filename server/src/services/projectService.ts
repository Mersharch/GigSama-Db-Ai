import { AppDataSource } from "../config/database";
import { Project } from "../entities/Project";
import { ERDResponse } from "./erdService";

export class ProjectService {
  private projectRepository = AppDataSource.getRepository(Project);

  async createProject(
    thread_id: string,
    title: string,
    userID: string,
    erdResponse: ERDResponse
  ): Promise<Project> {
    try {
      const project = new Project();
      project.id = thread_id;
      project.title = title;
      project.userID = userID;
      project.conversation = [
        {
          ...erdResponse,
          userInput: erdResponse.userInput ?? "",
        },
      ];

      const newProject = await this.projectRepository.save(project);
      return newProject;
    } catch (error) {
      console.error("Error creating project:", error);
      throw new Error("Error creating project");
    }
  }

  async getProject(id: string): Promise<Project | null> {
    try {
      const project = await this.projectRepository.findOneBy({ id });
      return project;
    } catch (error) {
      console.error("Error fetching project:", error);
      throw new Error("Error fetching project");
    }
  }

  async getAllProjects(id: string): Promise<Project[]> {
    try {
      const projects = await this.projectRepository.find({
        where: { userID: id },
      });
      return projects;
    } catch (error) {
      console.error("Error fetching all projects:", error);
      throw new Error("Error fetching all projects");
    }
  }

  async updateProject(
    id: string,
    erdResponse: ERDResponse
  ): Promise<Project | null> {
    try {
      const project = await this.projectRepository.findOneBy({ id });
      if (!project) return null;

      project.conversation = [
        ...(project.conversation || []),
        { ...erdResponse, userInput: erdResponse.userInput ?? "" },
      ];

      const updatedProject = await this.projectRepository.save(project);
      return updatedProject;
    } catch (error) {
      console.error("Error updating project:", error);
      throw new Error("Error updating project");
    }
  }
}

export const projectService = new ProjectService();
