import express from "express";
import { getTeamStats } from "./fetch_stats.js";

const app = express();

app.get("/", (req, res) => {
  res.send("API Prognósticos (API-Football) ONLINE ✔");
});

app.get("/stats", async (req, res) => {
  const { team } = req.query;

  if (!team) return res.json({ error: "Falta parâmetro ?team=" });

  const data = await getTeamStats(team);
  res.json(data);
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`API no ar na porta ${port}`));
