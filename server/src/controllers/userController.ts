import { Request, Response } from "express";
import { userService } from "../services/userService";

export const createUser = async (req: Request, res: Response) => {
  try {
    const userData = req.body;
    const newUser = await userService.createUser(userData);
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error creating user" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const loginResponse = await userService.loginUser(email, password);
    res.status(200).json(loginResponse);
  } catch (error: any) {
    console.error("Error logging in user:", error);
    res.status(401).json({ message: error.message });
  }
};

export const getUserDetails = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await userService.getUserDetails(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Error fetching user" });
  }
};
