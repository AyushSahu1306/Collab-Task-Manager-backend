import { Router } from "express";
import {query} from "../db/query";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/signup",async(req,res)=>{
    const {email,name,password} = req.body;

    if (!email || !name || !password) {
        return res.status(401).json({ error: "missing fields" });
    }

    const hash = await bcrypt.hash(password,10);

    try {
        const rows = await query(
            "INSERT INTO users(email,name,password_hash) VALUES ($1,$2,$3) RETURNING id,email,name",
            [email,name,hash]
        );

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }

        const token = jwt.sign(
            {userId:rows[0].id},
            process.env.JWT_SECRET,
            {expiresIn:"7d"}
        )
        res.json({token});
    } catch (error:any) {
        if (error.code === "23505") {
            // unique violation
            return res.status(409).json({ error: "email already exists" });
        }
        throw error;
    }
})

router.post("/login",async(req,res)=>{
    const {email,password} = req.body;

    if(!email || !password){
        res.status(401).json({error:"All fields required"});
    }

    const rows = await query(
        `SELECT id,password_hash FROM users WHERE email = $1`,
        [email]
    );

    if (!rows.length) {
        return res.status(401).json({ error: "invalid credentials" });
    }

    const valid = await bcrypt.compare(password,rows[0].password_hash);

    if(!valid){
        return res.status(401).json({ error: "invalid credentials" });
    }

    const token = jwt.sign(
        {userId: rows[0].id},
        process.env.SECRET!,
        {expiresIn:"7d"}
    );

    res.json({token});
})


export default router;