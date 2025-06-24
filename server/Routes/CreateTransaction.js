import express from "express";
import pool from "../db.js";
import dotenv from "dotenv";
import { checkJwt } from "../auth.js";

dotenv.config();

const route = express.Router();

route.use(express.json());
console.log(typeof checkJwt);
route.post("/", checkJwt, async (req, res) => {
  try {
    const gettx = req.body;
    const number = Number(gettx.amount);
    const addentry = await pool.query(
      "INSERT INTO transactions (auth0_id,type,amount,note,category) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [gettx.auth0_id, gettx.type, number, gettx.note, gettx.category]
    );
    console.log(addentry.rows);
    res.status(201).json(addentry.rows);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
});

route.get("/gettxs", checkJwt, async (req, res) => {
  try {
    console.log("route hit");
    const gettable = await pool.query("SELECT * FROM transactions");
    res.status(200).json(gettable.rows);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
});

route.post("/getonetx", checkJwt, async (req, res) => {
  try {
    const getid = req.body.id;
    const gettask = await pool.query(
      "SELECT * FROM transactions WHERE id = $1",
      [getid]
    );
    res.status(200).json(gettask.rows);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
});

export default route;
