import { Injectable, Logger } from '@nestjs/common';
import { execFile } from 'child_process';
import { existsSync } from 'fs';
import { mkdtemp, rm, writeFile } from 'fs/promises';
import * as os from 'os';
import * as path from 'path';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

/** Escape a Windows path for a PowerShell single-quoted literal. */
function psSingleQuotedLiteral(p: string): string {
  return `'${p.replace(/'/g, "''")}'`;
}

@Injectable()
export class PowershellParserService {
  private readonly log = new Logger(PowershellParserService.name);

  private readonly exe = path.join(
    process.env.SystemRoot || 'C:\\Windows',
    'System32',
    'WindowsPowerShell',
    'v1.0',
    'powershell.exe',
  );

  isAvailable(): boolean {
    return process.platform === 'win32' && existsSync(this.exe);
  }

  /**
   * True when the script is syntactically complete (no IncompleteInput parse errors).
   * Other parse errors still mean "complete" — execution may fail at runtime.
   */
  async isSyntacticallyComplete(source: string): Promise<boolean> {
    if (!this.isAvailable()) {
      throw new Error('PowerShell parser unavailable (non-Windows host or missing powershell.exe)');
    }
    const dir = await mkdtemp(path.join(os.tmpdir(), 'console-ps-parse-'));
    const tmp = path.join(dir, 'buffer.ps1');
    await writeFile(tmp, source, 'utf8');
    const lit = psSingleQuotedLiteral(tmp);
    const ps = [
      '$ErrorActionPreference = "Stop"',
      `$raw = Get-Content -LiteralPath ${lit} -Raw`,
      '$tokens = $null',
      '$errs = $null',
      '[void][System.Management.Automation.Language.Parser]::ParseInput($raw, [ref]$tokens, [ref]$errs)',
      'foreach ($x in @($errs)) {',
      '  if ($null -eq $x) { continue }',
      '  if ($x.IncompleteInput) { exit 1 }',
      '  $m = [string]$x.Message',
      "  if ($m -match '(?i)\\b(missing|incomplete)\\b') { exit 1 }",
      '}',
      'exit 0',
    ].join('\n');
    const encoded = Buffer.from(ps, 'utf16le').toString('base64');
    try {
      await execFileAsync(
        this.exe,
        [
          '-NoLogo',
          '-NoProfile',
          '-NonInteractive',
          '-ExecutionPolicy',
          'Bypass',
          '-EncodedCommand',
          encoded,
        ],
        { timeout: 12_000, windowsHide: true, maxBuffer: 1024 * 1024 },
      );
      return true;
    } catch (err: unknown) {
      const code = typeof err === 'object' && err !== null && 'code' in err ? (err as { code: number }).code : undefined;
      if (code === 1) {
        return false;
      }
      this.log.warn(`PowerShell parse helper failed: ${String(err)}`);
      throw err;
    } finally {
      try {
        await rm(dir, { recursive: true, force: true });
      } catch {
        /* ignore */
      }
    }
  }
}
