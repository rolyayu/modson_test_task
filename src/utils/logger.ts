import winston, { createLogger, format, transports, type Logger } from 'winston';
import { black, red, green, zebra, yellow, blue } from 'colors';

export class LoggerFactory {
    private constructor() { }

    static readonly getLogger = (className: string): Logger => {
        return createLogger({
            level: 'info',
            transports: this.getTranports(className),
        });
    };

    private static readonly getTranports = (className: string): winston.transport[] => {
        return process.env.NODE_ENV === 'production'
            ? [
                new winston.transports.File({
                    filename: 'error.log', level: 'error',
                    format: winston.format.combine(
                        this.getFormat(className)
                    )
                }),
                new winston.transports.File({
                    filename: 'logs.log',
                    format: winston.format.combine(
                        this.getFormat(className)
                    )
                }),
            ]
            : [
                new winston.transports.Console({ format: this.getFormat(className, false) }),
                new winston.transports.File({
                    filename: 'dummy.log',
                    format: winston.format.combine(
                        this.getFormat(className)
                    )
                }),
            ];
    };

    private static readonly getFormat = (className: string, isFile: boolean = true): winston.Logform.Format => {
        return format.printf(({ level, message }) => {
            const levelUpperCase = level.toUpperCase();
            const colorizedLevel = isFile ? levelUpperCase : this.getColorizedLevel(levelUpperCase);
            return `[${new Date().toISOString()}] [${className}] [${colorizedLevel}] ${message}`;
        });
    };

    private static readonly getColorizedLevel = (level: string): string => {
        switch (level) {
            case 'ERROR':
                return red(level);
            case 'INFO':
                return green(level);
            case 'WARN':
                return yellow(level);
            case 'DEBUG':
                return blue(level);
            case 'CRIT':
                return black(level);
            default:
                return zebra(level);
        }
    };
}
