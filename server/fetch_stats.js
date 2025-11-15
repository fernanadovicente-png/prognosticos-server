import axios from "axios";
import { API_KEY } from "./config.js";

export async function getTeamStats(teamName) {
  const BASE = "https://api.football-data.org/v4";

  // PASSO 1: Procurar equipa
  const teams = await axios.get(`${BASE}/teams`, {
    headers: { "X-Auth-Token": API_KEY }
  });

  const team = teams.data.teams.find(t =>
    t.name.toLowerCase().includes(teamName.toLowerCase())
  );

  if (!team) return { error: "Equipa não encontrada" };

  const id = team.id;

  // PASSO 2: Buscar últimos jogos (10)
  const matches = await axios.get(`${BASE}/teams/${id}/matches?limit=10`, {
    headers: { "X-Auth-Token": API_KEY }
  });

  let gm = [];
  let gs = [];
  let forma = [];

  for (let m of matches.data.matches) {
    let home = m.homeTeam.id === id;
    let gFor = home ? m.score.fullTime.home : m.score.fullTime.away;
    let gAgst = home ? m.score.fullTime.away : m.score.fullTime.home;

    gm.push(gFor);
    gs.push(gAgst);

    forma.push(
      gFor > gAgst ? "V" : gFor < gAgst ? "D" : "E"
    );
  }

  return { gm, gs, forma };
}
