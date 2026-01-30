import { Router } from "express";
import { query } from "../db/query";
import { requireWorkspaceMember } from "../middleware/workspaceAuth";


const router = Router();

router.post("/workspaces/:workspaceId/projects",requireWorkspaceMember(),async(req,res)=>{
    const {workspaceId} = req.params;
    const {name} = req.body;

    if(!name){
        return res.status(400).json({error:"name required"});
    }

    const rows = await query(
        `INSERT INTO projects(workspace_id,name) VALUES($1,$2) RETURNING id,name`,
        [workspaceId,name]
    );

    res.status(201).json(rows[0]);
})

export default router;