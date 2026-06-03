import { isValidSlug } from "../utils/slug.js";

const SCHEMAS = {
  prestador: {
    required: ['slug', 'nome', 'titulo', 'categoria', 'cidade', 'estado'],
    optional: [
      'whatsapp', 'email', 'foto', 'avatarInicial', 'status', 'precoReferencia',
      'experiencia', 'servicos', 'diferenciais', 'experiencias', 'cursos',
      'portfolio', 'observacoes', 'ativo', 'destaque', 'ordem', 'createdAt',
      'updatedAt', 'verificado', 'bairro', 'regiaoAtendimento', 'chamada', 'tags'
    ]
  },
  empresa: {
    required: ['slug', 'nome', 'tipo', 'cidade', 'estado'],
    optional: [
      'whatsapp', 'email', 'site', 'logo', 'avatarInicial', 'status',
      'segmentos', 'diferenciais', 'ativo', 'destaque', 'ordem', 'createdAt',
      'updatedAt', 'verificada', 'regiaoAtendimento', 'descricao'
    ]
  },
  vaga: {
    required: ['slug', 'empresaSlug', 'titulo', 'categoria', 'funcao', 'cidade', 'estado'],
    optional: [
      'servico', 'bairro', 'tipoContrato', 'regime', 'salario', 'beneficios',
      'requisitos', 'atividades', 'horario', 'contato', 'status', 'dataPublicacao',
      'validade', 'observacoes', 'ativo', 'destaque', 'ordem', 'createdAt', 'updatedAt'
    ]
  },
  servico: {
    required: ['slug', 'nome', 'subtitulo', 'preco'],
    optional: ['imagem', 'destaque', 'descricao', 'ativo', 'ordem', 'createdAt', 'updatedAt']
  }
};

/**
 * Valida um item contra seu schema
 * @param {object} item - item a validar
 * @param {string} type - tipo (prestador, empresa, vaga, servico)
 * @returns {object} {valid: boolean, errors: string[]}
 */
export function validateItem(item, type) {
  const schema = SCHEMAS[type];
  if (!schema) {
    return { valid: false, errors: [`Tipo desconhecido: ${type}`] };
  }

  const errors = [];

  // Validar campos obrigatórios
  for (const field of schema.required) {
    if (!item[field]) {
      errors.push(`[${type}] Campo obrigatório faltando: "${field}"`);
    }
  }

  // Validar slugs (sem espaços, acentos, maiúsculas)
  if (item.slug && !isValidSlug(item.slug)) {
    errors.push(`[${type}] Slug inválido: "${item.slug}" (use apenas letras minúsculas, números e hífens)`);
  }

  // Validar empresaSlug exists (será checado em load data)
  // Não fazer aqui pois precisaría de contexto global

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Valida um arquivo JSON completo (prestadores, empresas, vagas, servicos)
 * @param {object} data - objeto com {items: [...]}
 * @param {string} type - tipo (prestadores, empresas, vagas, servicos)
 * @returns {object} {valid: boolean, errors: string[], warnings: string[]}
 */
export function validateDataFile(data, type) {
  const errors = [];
  const warnings = [];
  const itemType = type.endsWith('s') ? type.slice(0, -1) : type; // prestadores → prestador

  if (!Array.isArray(data.items)) {
    errors.push(`Estrutura inválida: esperado {items: array}, recebido`);
    return { valid: false, errors, warnings };
  }

  if (data.items.length === 0) {
    warnings.push(`Nenhum item encontrado em ${type}`);
  }

  const slugs = new Set();

  for (let i = 0; i < data.items.length; i++) {
    const item = data.items[i];
    const validation = validateItem(item, itemType);

    if (!validation.valid) {
      validation.errors.forEach(err => {
        errors.push(`[Item ${i}] ${err}`);
      });
    }

    // Verificar slugs duplicados
    if (item.slug) {
      if (slugs.has(item.slug)) {
        errors.push(`[Item ${i}] Slug duplicado: "${item.slug}"`);
      }
      slugs.add(item.slug);
    }

    // Warnings para items inativos
    if (item.ativo === false) {
      warnings.push(`[Item ${i}] ${item.nome || item.titulo} marcado como inativo`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Log de validation errors de forma amigável
 * @param {object} validation - resultado de validateDataFile
 * @param {string} type - tipo para logging
 */
export function logValidationResult(validation, type) {
  const prefix = `[${type}]`;

  if (validation.errors.length > 0) {
    console.error(`${prefix} ❌ Erros de schema:`);
    validation.errors.forEach(err => console.error(`  ${err}`));
  }

  if (validation.warnings.length > 0) {
    console.warn(`${prefix} ⚠️ Avisos:`);
    validation.warnings.forEach(warn => console.warn(`  ${warn}`));
  }

  if (validation.valid && validation.warnings.length === 0) {
    console.info(`${prefix} ✅ Schema válido`);
  }
}
