/**
 * DICI Validador - Modulo principal
 *
 * Fluxo:
 * 1. Sanitizacao bruta (normaliza campos)
 * 2. Normalizacao (IBGE, velocidade, meio)
 * 3. Correcao tecnologia (fibra→FTTH, radio→ETHERNET)
 * 4. Agrupamento de duplicidades (duplo)
 * 5. Auditoria de acessos
 */

const { sanitizarDados } = require("./normalizacao");
const { agruparComSeguranca } = require("./agrupamento");
const { auditarAcessos, auditarTecnologia } = require("./auditoria");

function processarDICI(rows) {
  // 1. Sanitizacao
  const sanitizados = sanitizarDados(rows);

  // 2. Auditoria pre-agrupamento
  const totalAntes = sanitizados.reduce((s, r) => s + Number(r.ACESSOS || 0), 0);

  // 3. Agrupamento (duplo para garantia)
  const agrupado = agruparComSeguranca(sanitizados);

  // 4. Auditoria pos-agrupamento
  const auditoria = auditarAcessos(agrupado, totalAntes);
  if (!auditoria.ok) {
    throw new Error(auditoria.erro);
  }

  // 5. Auditoria de tecnologia
  auditarTecnologia(agrupado);

  return {
    dados: agrupado,
    acessosIniciais: totalAntes,
    acessosFinais: auditoria.depois,
    registrosIniciais: sanitizados.length,
    registrosFinais: agrupado.length,
  };
}

module.exports = { processarDICI };
