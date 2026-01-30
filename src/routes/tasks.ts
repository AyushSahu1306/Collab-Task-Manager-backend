import { Router } from "express";
import { query } from "../db/query";
import { requireWorkspaceMember } from "../middleware/workspaceAuth";

const router = Router();

router.post("/projects/:projectId/tasks",async(req,res)=>{
    const {projectId} = req.params;
    const {title} = req.body;

    if (!title) {
      return res.status(400).json({ error: "title required" });
    }

    const projects = await query(
        `SELECT workspace_id FROM projects WHERE id = $1`,
        [projectId]
    );

    if(projects.length === 0){
        return res.status(404).json({error:"project not found"});
    }

    const workspaceId = projects[0].workspace_id;

    const members = await query(
        `SELECT 1 FROM workspace_members WHERE workspace_id = $1 and user_id = $2`,
        [workspaceId,req.user!.id]
    );

    if(members.length === 0){
        return res.status(403).json({ error: "not workspace member" });
    }

    const rows = await query(
        `INSERT INTO tasks(project_id,workspace_id,title)
        VALUES($1,$2,$3) RETURNING id,title`,
        [projectId,workspaceId,title]
    );

    res.status(201).json(rows[0]);
})


router.post("/tasks/:taskId/assign",async(req,res) => {
    const {taskId} = req.params;
    const {assigneeId} = req.body;

    if (!assigneeId) {
        return res.status(400).json({ error: "assigneeId required" });
    }

    const tasks = await query(
        `SELECT workspace_id FROM tasks WHERE id = $1`,
        [taskId]
    );

    if (tasks.length === 0) {
        return res.status(404).json({ error: "task not found" });
    }

    const workspaceId = tasks[0].workspace_id;
    const members = await query(
        `SELECT 1 FROM workspace_members WHERE workspace_id = $1 AND user_id = $2`,
        [workspaceId,req.user!.id]
    );

    if (members.length === 0) {
        return res.status(403).json({ error: "not workspace member" });
    }

    await query(
        `UPDATE tasks SET assignee_id = $1 WHERE id = $2`,
        [assigneeId,taskId]
    );

    res.json({assigned:true});
})

export default router;