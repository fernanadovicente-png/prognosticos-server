import fetch from "node-fetch";
import { API_KEY, API_HOST } from "/etc/secrets/config.js";

const BASE_URL = "https://api-football-v1.p.rapidapi.com/v3";

export async function getTeamStats(teamName) {
  try {
    // 1) Buscar ID da equipa pelo nome
    const searchUrl = `${BASE_URL}/teams?name=${teamName}`;
    const searchRes = await fetch(searchUrl, {
      headers: {
        "x-rapidapi-key": API_KEY,
        "x-rapidapi-host": "api-football-v1.p.rapidapi.com"
      }
    });

    const searchData = await searchRes.json();

    if (!searchData.response || searchData.response.length === 0) {
      return { error: "Equipa não encontrada" };
    }

    const teamID = searchData.response[0].team.id;

    // 2) Buscar últimos jogos
    const fixturesUrl = `${BASE_URL}/fixtures?team=${teamID}&last=5`;
    const fixturesRes = await fetch(fixturesUrl, {
      headers: {
        "x-rapidapi-key": API_KEY,
        "x-rapidapi-host": "api-football-v1.p.rapidapi.com"
      }
    });

    const fixturesData = await fixturesRes.json();

    if (!fixturesData.response || fixturesData.response.length === 0) {
      return { error: "Sem jogos recentes" };
    }

    // Processar estatísticas
    const jogos = fixturesData.response.map(f => {
      const team = f.teams.home.id === teamID ? "home" : "away";

      const gm = f.goals[team];
      const gs = team === "home" ? f.goals.away : f.goals.home;

      let resultado = "D";
      if (gm > gs) resultado = "V";
      if (gm === gs) resultado = "E";

      return { gm, gs, resultado };
    });

    const gm = jogos.map(j => j.gm);
    const gs = jogos.map(j => j.gs);
    const forma = jogos.map(j => j.resultado);

    return {
      team: teamName,
      gm,
      gs,
      forma
    };

  } catch (err) {
    return { error: "Erro ao buscar dados", details: err.message };
  }
}
