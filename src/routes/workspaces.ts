import { Router } from "express";
import { withTransaction } from "../db/transaction";
import { requireWorkspaceMember, requireWorkspaceOwner } from "../middleware/workspaceAuth";

const router = Router();

router.post("/",async(req,res)=>{
    const {name,ownerId} = req.body;

    if (!name || !ownerId) {
        return res.status(400).json({ error: "name and ownerId required" });
    }

    try {
        const result = await withTransaction(async (client)=>{
            const workspace = await client.query(
                "INSERT INTO workspaces(name) VALUES ($1) RETURNING id,name",
                [name]
            );

            await client.query(
                "INSERT INTO workspace_members(workspace_id,user_id,role) VALUES ($1,$2,'owner')",
                [workspace.rows[0].id,ownerId]
            );

            return workspace.rows[0];
        });

        return res.status(201).json(result);
    } catch (error) {
        throw error;
    }
})

router.get("/:workspaceId",requireWorkspaceMember(),async(req,res)=>{
    const {workspaceId} = req.params;
    res.json({workspaceId});
})


router.delete("/:workspaceId",requireWorkspaceOwner(),async(req,res)=>{
    res.json({deleted:true});
})
export default router;