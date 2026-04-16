/**
 * Regras de mapeamento DICI (Anatel)
 *
 * TIPO_MEIO → TIPO_TECNOLOGIA:
 *   fibra  → FTTH
 *   radio  → ETHERNET
 *
 * Wi-Fi NAO existe no DICI - invalido para a Anatel
 * TIPO_ATENDIMENTO NULO → URBANO
 * TIPO_PRODUTO sempre = "internet"
 */

function corrigirTecnologia(meio) {
  const m = String(meio || "").toLowerCase().trim();
  if (m === "fibra") return "FTTH";
  if (m === "radio") return "ETHERNET";
  return "FTTH"; // fallback seguro
}

function normalizarAtendimento(val) {
  if (!val || String(val).toUpperCase() === "NULO") return "URBANO";
  return String(val).toUpperCase();
}

function normalizarMeio(val) {
  return String(val || "fibra")
    .replace(/NULO/gi, "radio")
    .replace(/radiointernet/gi, "radio")
    .trim()
    .toLowerCase();
}

function normalizarVelocidade(v) {
  const val = String(v || "").replace(",", ".");
  const num = parseFloat(val);
  if (isNaN(num) || num <= 0) return "100,00";
  return num.toFixed(2).replace(".", ",");
}

module.exports = {
  corrigirTecnologia,
  normalizarAtendimento,
  normalizarMeio,
  normalizarVelocidade,
};
