"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var PowershellParserService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PowershellParserService = void 0;
const common_1 = require("@nestjs/common");
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const os = __importStar(require("os"));
const path = __importStar(require("path"));
const util_1 = require("util");
const execFileAsync = (0, util_1.promisify)(child_process_1.execFile);
function psSingleQuotedLiteral(p) {
    return `'${p.replace(/'/g, "''")}'`;
}
let PowershellParserService = PowershellParserService_1 = class PowershellParserService {
    constructor() {
        this.log = new common_1.Logger(PowershellParserService_1.name);
        this.exe = path.join(process.env.SystemRoot || 'C:\\Windows', 'System32', 'WindowsPowerShell', 'v1.0', 'powershell.exe');
    }
    isAvailable() {
        return process.platform === 'win32' && (0, fs_1.existsSync)(this.exe);
    }
    async isSyntacticallyComplete(source) {
        if (!this.isAvailable()) {
            throw new Error('PowerShell parser unavailable (non-Windows host or missing powershell.exe)');
        }
        const dir = await (0, promises_1.mkdtemp)(path.join(os.tmpdir(), 'console-ps-parse-'));
        const tmp = path.join(dir, 'buffer.ps1');
        await (0, promises_1.writeFile)(tmp, source, 'utf8');
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
            await execFileAsync(this.exe, [
                '-NoLogo',
                '-NoProfile',
                '-NonInteractive',
                '-ExecutionPolicy',
                'Bypass',
                '-EncodedCommand',
                encoded,
            ], { timeout: 12_000, windowsHide: true, maxBuffer: 1024 * 1024 });
            return true;
        }
        catch (err) {
            const code = typeof err === 'object' && err !== null && 'code' in err ? err.code : undefined;
            if (code === 1) {
                return false;
            }
            this.log.warn(`PowerShell parse helper failed: ${String(err)}`);
            throw err;
        }
        finally {
            try {
                await (0, promises_1.rm)(dir, { recursive: true, force: true });
            }
            catch {
            }
        }
    }
};
exports.PowershellParserService = PowershellParserService;
exports.PowershellParserService = PowershellParserService = PowershellParserService_1 = __decorate([
    (0, common_1.Injectable)()
], PowershellParserService);
//# sourceMappingURL=powershell-parser.service.js.map