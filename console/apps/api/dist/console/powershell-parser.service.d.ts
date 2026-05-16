export declare class PowershellParserService {
    private readonly log;
    private readonly exe;
    isAvailable(): boolean;
    isSyntacticallyComplete(source: string): Promise<boolean>;
}
