import { AppDataSource } from "../config/database";
import { User } from "../entities/User";
import bcrypt from "bcrypt";
import { generateToken } from "../util/token";

export class UserService {
  private userRepository = AppDataSource.getRepository(User);

  async createUser(userData: any): Promise<{ user: User; token: string }> {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      userData.password = hashedPassword;

      const newUser = await this.userRepository.save(userData);
      const token = generateToken(newUser);
      return { user: newUser, token };
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Error creating user");
    }
  }

  async loginUser(
    email: string,
    password: string
  ): Promise<{ user: User; token: string } | null> {
    try {
      const user = await this.userRepository.findOneBy({ email });
      if (!user) {
        throw new Error("User not found");
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        user.password as string
      );
      if (!isPasswordValid) {
        throw new Error("Invalid password");
      }

      const token = generateToken(user);
      return { user, token };
    } catch (error) {
      console.error("Error logging in user:", error);
      throw new Error("Error logging in user");
    }
  }

  async getUserDetails(userId: string): Promise<User | null> {
    try {
      const user = await this.userRepository.findOneBy({ id: userId });
      return user;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw new Error("Error fetching user");
    }
  }
}

export const userService = new UserService();
