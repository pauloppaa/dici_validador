/**
 * Sanitizacao de dados DICI
 * Aplica regras de normalizacao em cada linha do CSV
 */

const {
  corrigirTecnologia,
  normalizarAtendimento,
  normalizarMeio,
  normalizarVelocidade,
} = require("./regras");

function sanitizarLinha(r) {
  const meio = normalizarMeio(r.TIPO_MEIO);
  const tecnologia = corrigirTecnologia(meio);

  // Log se Wi-Fi foi detectado e corrigido
  if (/wi-?fi/i.test(r.TIPO_TECNOLOGIA || "")) {
    console.log(`⚠️ Wi-Fi detectado e corrigido para ${tecnologia}`);
  }

  return {
    ...r,
    TIPO_MEIO: meio,
    TIPO_TECNOLOGIA: tecnologia,
    TIPO_ATENDIMENTO: normalizarAtendimento(r.TIPO_ATENDIMENTO),
    TIPO_PRODUTO: "internet",
    VELOCIDADE: normalizarVelocidade(r.VELOCIDADE),
  };
}

function sanitizarDados(rows) {
  return rows.map(sanitizarLinha);
}

module.exports = { sanitizarLinha, sanitizarDados };
