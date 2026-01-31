import {Request,Response,NextFunction} from "express";
import jwt from "jsonwebtoken";

export function jwtAuth(req:Request,res:Response,next:NextFunction){
    const header = req.header("authorization");

    if(!header){
      return res.status(401).json({ error: "missing auth header" });
    }

    const token = header.split(" ")[1];

    try {
      const payload = jwt.verify(token,process.env.JWT_SECRET!) as { userId: string };
      req.user = {
        id:payload.userId
      }
      next();
    } catch (error) {
      return res.status(401).json({ error: "invalid token" });
    }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: "unauthenticated" });
  }
  next();
}
