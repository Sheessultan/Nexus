const CLIXML_HEAD = /#<\s*CLIXML\s*\r?\n?/gi;
const ORPHAN_OBJ = /<Obj\s+S="(?:progress|information|verbose|warning|debug)"[\s\S]*?<\/Obj>\s*/gi;

/** Remove PowerShell CLIXML / serialized stream noise from redirected output. */
export function stripPsClixmlNoise(text: string): string {
  if (!text) {
    return text;
  }
  let t = text.replace(CLIXML_HEAD, '');
  let lower = t.toLowerCase();
  while (lower.includes('<objs')) {
    const idx = lower.indexOf('<objs');
    const endTag = '</objs>';
    const j = lower.indexOf(endTag, idx);
    if (j < 0) {
      t = t.slice(0, idx);
      break;
    }
    t = t.slice(0, idx) + t.slice(j + endTag.length);
    lower = t.toLowerCase();
  }
  for (let i = 0; i < 64; i++) {
    const next = t.replace(ORPHAN_OBJ, '');
    if (next === t) {
      break;
    }
    t = next;
  }
  return t;
}
