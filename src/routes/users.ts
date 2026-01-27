import { Router } from "express";
import {query} from "../db/query";

const router = Router();

router.get("/",async(_,res)=>{
    const users = await query("SELECT id, email,name FROM users");
    res.json(users);
})

export default router;