/**
 * Agrupamento de duplicidades DICI
 * Mescla registros com mesma chave composta e soma ACESSOS
 */

function agruparDuplicidades(df) {
  const chave = (r) =>
    [
      r.CNPJ,
      r.ANO,
      r.MES,
      r.COD_IBGE,
      r.TIPO_CLIENTE,
      r.TIPO_ATENDIMENTO,
      r.TIPO_MEIO,
      r.TIPO_PRODUTO,
      r.TIPO_TECNOLOGIA,
      r.VELOCIDADE,
    ].join("|");

  return Object.values(
    df.reduce((acc, r) => {
      const k = chave(r);
      if (!acc[k]) acc[k] = { ...r, ACESSOS: 0 };
      acc[k].ACESSOS += r.ACESSOS || 0;
      return acc;
    }, {})
  );
}

/**
 * Duplo agrupamento - garantia contra duplicidades residuais
 */
function agruparComSeguranca(dados) {
  return agruparDuplicidades(agruparDuplicidades(dados));
}

module.exports = { agruparDuplicidades, agruparComSeguranca };
