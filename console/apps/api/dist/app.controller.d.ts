export declare class AppController {
    root(): {
        service: string;
        ok: boolean;
    };
    health(): {
        status: string;
        uptime: number;
    };
}
