import { pool } from ".";

export async function query<T = any>(text:string,params?:any[]):Promise<T[]>{
    const result = await pool.query(text,params);
    return result.rows;
}