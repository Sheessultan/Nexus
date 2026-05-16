/**
 * Heuristic fallback when the API host is not Windows or the PowerShell parser
 * helper fails. Primary path: `PowershellParserService` uses
 * `[System.Management.Automation.Language.Parser]::ParseInput` (IncompleteInput).
 *
 * Comment handling: block `<# #>` and `#` line comments are stripped for analysis
 * so scripts with trailing comment lines or commented-out braces do not wedge the buffer.
 */

function stripPsBlockComments(s: string): string {
  let out = s;
  for (let guard = 0; guard < 32; guard += 1) {
    const i = out.indexOf('<#');
    if (i < 0) break;
    const j = out.indexOf('#>', i + 2);
    if (j < 0) break;
    out = `${out.slice(0, i)}\n${out.slice(j + 2)}`;
  }
  return out;
}

/** Remove `# …` to end-of-line outside single/double-quoted strings (PS analysis only). */
function stripPsLineComments(s: string): string {
  let r = '';
  let i = 0;
  let inSingle = false;
  let inDouble = false;
  while (i < s.length) {
    const c = s[i]!;
    const next = s[i + 1];
    if (inSingle) {
      r += c;
      if (c === "'" && (i === 0 || s[i - 1] !== '`')) inSingle = false;
      i += 1;
      continue;
    }
    if (inDouble) {
      r += c;
      if (c === '`' && next != null) {
        r += next;
        i += 2;
        continue;
      }
      if (c === '"') inDouble = false;
      i += 1;
      continue;
    }
    if (c === "'") {
      inSingle = true;
      r += c;
      i += 1;
      continue;
    }
    if (c === '"') {
      inDouble = true;
      r += c;
      i += 1;
      continue;
    }
    if (c === '#') {
      while (i < s.length && s[i] !== '\n') i += 1;
      r += '\n';
      if (i < s.length && s[i] === '\n') i += 1;
      continue;
    }
    r += c;
    i += 1;
  }
  return r;
}

/** Text used for PS “is script complete?” heuristics (comments ignored). */
export function powershellScriptForCompletionHeuristic(script: string): string {
  const normalized = script.replace(/\r\n/g, '\n');
  return stripPsLineComments(stripPsBlockComments(normalized));
}

/** CMD: drop full-line REM / :: comments for delimiter checks. */
function stripCmdFullLineComments(body: string): string {
  return body
    .split('\n')
    .map((line) => {
      const t = line.trim();
      if (/^rem(\s|$)/i.test(t)) return '';
      if (t.startsWith('::')) return '';
      return line;
    })
    .join('\n');
}

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
  const analyzed = powershellScriptForCompletionHeuristic(script);
  const body = analyzed.trimEnd();
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
  const raw = script.replace(/\r\n/g, '\n');
  const body = stripCmdFullLineComments(raw).trimEnd();
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
