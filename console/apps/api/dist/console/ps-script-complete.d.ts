export declare function powershellScriptForCompletionHeuristic(script: string): string;
export declare function psDelimiterBalance(script: string): {
    paren: number;
    brace: number;
};
export declare function isPowershellScriptComplete(script: string): boolean;
export declare function isCmdScriptComplete(script: string): boolean;
