import { Request, Response, NextFunction } from "express";
import { verifyToken } from "./token";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const user = verifyToken(token);
    console.log(user);

    req.params = { ...req.params, id: user.id };
    next();
  } catch (error) {
    return res.sendStatus(403);
  }
};
