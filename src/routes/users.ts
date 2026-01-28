import { Router } from "express";
import {query} from "../db/query";

const router = Router();

router.post("/",async(req,res)=>{
    const {email,name} = req.body;

    if (!email || !name) {
        return res.status(400).json({ error: "email and name required" });
    }

    try {
        const rows = await query(
            "INSERT INTO users(email,name) VALUES ($1,$2) RETURNING id,email,name",
            [email,name]
        );
        res.status(201).json(rows[0]);
    } catch (error:any) {
        if (error.code === "23505") {
            // unique violation
            return res.status(409).json({ error: "email already exists" });
        }
        throw error;
    }
})


export default router;