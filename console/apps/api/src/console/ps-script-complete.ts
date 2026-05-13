/**
 * Heuristic: is this PowerShell fragment safe to execute as one script block
 * (balanced delimiters, no dangling pipe, no open quotes)?
 * Used by the gateway to buffer multi-line `terminal:input` until complete.
 */

function lastNonEmptyLine(script: string): string {
  const lines = script.replace(/\r\n/g, '\n').split('\n');
  for (let i = lines.length - 1; i >= 0; i--) {
    const t = lines[i]?.trimEnd() ?? '';
    if (t.trim().length > 0) return t;
  }
  return '';
}

/** Balanced ( ) and { } outside of ' ' and " " (simplified; ignores here-strings). */
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

  // Line continuation
  if (/`[\s\t]*$/.test(last)) return false;

  // Dangling pipeline operator
  if (/\|\s*$/.test(last)) return false;

  const { paren, brace } = psDelimiterBalance(body);
  if (paren !== 0 || brace !== 0) return false;

  // Still inside quotes (unterminated)
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

  // Block headers that expect a body on the next line(s)
  if (/^\s*(else|catch|finally)\s*$/i.test(last)) return false;

  return true;
}

/** CMD: incomplete if open paren for block or line ends with caret continuation. */
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
