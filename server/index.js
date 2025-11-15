import express from "express";
import { getTeamStats } from "./fetch_stats.js";

const app = express();

app.get("/stats", async (req, res) => {
  const team = req.query.team;

  const data = await getTeamStats(team);

  res.json(data);
});

app.listen(process.env.PORT || 3000, () => {
  console.log("API pronta ✔");
});

