/**
 * Auditoria de dados DICI
 * Valica integridade dos dados antes do envio
 */

function auditarAcessos(dados, totalEsperado) {
  const totalCalculado = dados.reduce((s, r) => s + Number(r.ACESSOS || 0), 0);

  if (totalEsperado !== totalCalculado) {
    const erro = `ERRO: acessos divergentes - antes: ${totalEsperado}, depois: ${totalCalculado}`;
    console.error(erro);
    return { ok: false, erro, antes: totalEsperado, depois: totalCalculado };
  }

  return { ok: true, antes: totalEsperado, depois: totalCalculado };
}

function auditarTecnologia(dados) {
  const erros = dados.filter((r) => {
    const meio = String(r.TIPO_MEIO || "").toLowerCase();
    const tec = String(r.TIPO_TECNOLOGIA || "").toUpperCase();

    if (meio === "fibra" && tec !== "FTTH") return true;
    if (meio === "radio" && tec !== "ETHERNET") return true;
    return false;
  });

  if (erros.length > 0) {
    console.error(`⚠️ ${erros.length} registros com TIPO_TECNOLOGIA inconsistente:`);
    erros.forEach((e) =>
      console.error(`  CNPJ=${e.CNPJ} IBGE=${e.COD_IBGE} MEIO=${e.TIPO_MEIO} TEC=${e.TIPO_TECNOLOGIA}`)
    );
  }

  return erros;
}

module.exports = { auditarAcessos, auditarTecnologia };
