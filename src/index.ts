import express from "express";
import { db } from "./db";

const app = express();

app.listen(4000, async () => {
  (await db.connect()).release();
  console.log("listening");
});
