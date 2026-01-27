import "dotenv/config";
import express from "express";
import { pool } from "./db";

const app = express();

app.use(express.json());

app.get("/health",async (_,res)=>{
    try {
        await pool.query("select 1");
        res.json({status:"ok"});
    } catch (error:any) {
        res.status(500).json({ status: "db_error",message:error.message });
    }
})

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});
