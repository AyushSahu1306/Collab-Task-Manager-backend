import {Request,Response,NextFunction} from "express";
import { query } from "../db/query";

export function requireWorkspaceMember(){
    return async (req:Request,res:Response,next:NextFunction) => {
        const userId = req.user!.id;
        const workspaceId = req.params.workspaceId;

        const rows = await query(
            `SELECT 1 FROM workspace_members WHERE workspace_id = $1 AND user_id = $2`,
            [workspaceId,userId]
        );
    if (rows.length === 0) {
        return res.status(403).json({ error: "not workspace member" });
    }

    next();
    }
}

export function requireWorkspaceOwner() {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    const workspaceId = req.params.workspaceId;

    const rows = await query(
      `select 1 from workspace_members
       where workspace_id = $1 and user_id = $2 and role = 'owner'`,
      [workspaceId, userId]
    );

    if (rows.length === 0) {
      return res.status(403).json({ error: "not workspace owner" });
    }

    next();
  };
}
