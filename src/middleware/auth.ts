import {Request,Response,NextFunction} from "express";

export function auth(req:Request,res:Response,next:NextFunction) {
    const userId = req.header("x-user-id");

    if(!userId){
        return res.status(401).json({ error: "missing x-user-id header" });
    }

    req.user = {id:userId};

    next();
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: "unauthenticated" });
  }
  next();
}
