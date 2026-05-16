/**
 * Same heuristics as `apps/api/src/console/ps-script-complete.ts` (keep in sync).
 */

function lastNonEmptyLine(script: string): string {
  const lines = script.replace(/\r\n/g, '\n').split('\n');
  for (let i = lines.length - 1; i >= 0; i--) {
    const t = lines[i]?.trimEnd() ?? '';
    if (t.trim().length > 0) return t;
  }
  return '';
}

export function psDelimiterBalance(script: string): { paren: number; brace: number } {
  let paren = 0;
  let brace = 0;
  let i = 0;
  let inSingle = false;
  let inDouble = false;
  while (i < script.length) {
    const c = script[i]!;
    const next = script[i + 1];
    if (inSingle) {
      if (c === "'" && (i === 0 || script[i - 1] !== '`')) inSingle = false;
      i++;
      continue;
    }
    if (inDouble) {
      if (c === '`' && next != null) {
        i += 2;
        continue;
      }
      if (c === '"') inDouble = false;
      i++;
      continue;
    }
    if (c === "'") {
      inSingle = true;
      i++;
      continue;
    }
    if (c === '"') {
      inDouble = true;
      i++;
      continue;
    }
    if (c === '(') paren++;
    else if (c === ')') paren--;
    else if (c === '{') brace++;
    else if (c === '}') brace--;
    i++;
  }
  return { paren, brace };
}

export function isPowershellScriptComplete(script: string): boolean {
  const body = script.replace(/\r\n/g, '\n').trimEnd();
  if (!body.trim()) return false;

  const last = lastNonEmptyLine(body);
  if (!last) return false;

  if (/`[\s\t]*$/.test(last)) return false;
  if (/\|\s*$/.test(last)) return false;

  const { paren, brace } = psDelimiterBalance(body);
  if (paren !== 0 || brace !== 0) return false;

  let inSingle = false;
  let inDouble = false;
  let i = 0;
  while (i < body.length) {
    const c = body[i]!;
    const next = body[i + 1];
    if (inSingle) {
      if (c === "'" && (i === 0 || body[i - 1] !== '`')) inSingle = false;
      i++;
      continue;
    }
    if (inDouble) {
      if (c === '`' && next != null) {
        i += 2;
        continue;
      }
      if (c === '"') inDouble = false;
      i++;
      continue;
    }
    if (c === "'") {
      inSingle = true;
      i++;
      continue;
    }
    if (c === '"') {
      inDouble = true;
      i++;
      continue;
    }
    i++;
  }
  if (inSingle || inDouble) return false;

  if (/^\s*(else|catch|finally)\s*$/i.test(last)) return false;

  return true;
}

export function isCmdScriptComplete(script: string): boolean {
  const body = script.replace(/\r\n/g, '\n').trimEnd();
  if (!body.trim()) return false;
  const lines = body.split('\n');
  const last = lines[lines.length - 1]?.trimEnd() ?? '';
  if (last.endsWith('^')) return false;
  let depth = 0;
  let inQuote = false;
  for (let i = 0; i < body.length; i++) {
    const c = body[i]!;
    if (c === '"') inQuote = !inQuote;
    if (inQuote) continue;
    if (c === '(') depth++;
    else if (c === ')') depth--;
  }
  return depth === 0;
}
