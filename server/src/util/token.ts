import jwt from "jsonwebtoken";
import { User } from "../entities/User";

const jwtSecret = process.env.JWT_SECRET;

export const generateToken = (user: User): string => {
  if (!jwtSecret) {
    throw new Error("JWT secret is not defined");
  }

  const token = jwt.sign({ id: user.id }, jwtSecret, {
    expiresIn: "1h",
  });
  return token;
};

export const verifyToken = (token: string): any => {
  if (!jwtSecret) {
    throw new Error("JWT secret is not defined");
  }

  try {
    return jwt.verify(token, jwtSecret);
  } catch (error) {
    console.error("Invalid token:", error);
    throw new Error("Invalid token");
  }
};
