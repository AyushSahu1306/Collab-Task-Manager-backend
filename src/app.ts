import "dotenv/config";
import express from "express";
import { pool } from "./db";
import usersRouter from "./routes/users"
import workspaceRouter from "./routes/workspaces"
import { auth } from "./middleware/auth";
import { errorHandler } from "./middleware/error";
import projectRouter from "./routes/projects"
import tasksRouter from "./routes/tasks"

const app = express();

app.use(express.json());
app.use("/api",auth);

app.use("/api/users",usersRouter);

app.use("/api/workspaces",workspaceRouter);

app.use("/api",projectRouter);

app.use("/api",tasksRouter);

app.get("/health",async (_,res)=>{
    try {
        await pool.query("select 1");
        res.json({status:"ok"});
    } catch (error:any) {
        res.status(500).json({ status: "db_error",message:error.message });
    }
})


app.use(errorHandler);


const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});
