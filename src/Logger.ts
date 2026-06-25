import { LogLevel } from './LogLevel'
import { MaybePromise } from './MaybePromise'
import { AsyncLogWriter, LogWriter } from './writer'

/**
 * A logger that accepts log records and forwards them to a {@link LogWriter}.
 *
 * The generic `Writer` type controls whether logging is synchronous or asynchronous.
 */
export class Logger<Writer extends LogWriter | AsyncLogWriter = LogWriter> {
    /**
     * Creates a new `Logger` instance.
     * @param writer - The log writer to receive records.
     * @param tags - Optional tags to attach to every record.
     */
    constructor(
        private readonly writer: Writer,
        private readonly tags: string[] = []
    ) {}

    /**
     * Extracts an optional message string from the argument list.
     * If the first argument is a string it is treated as the message;
     * otherwise, if the last argument is a string it is treated as the message.
     * @param args - The raw arguments passed to a log method.
     * @returns The message and remaining arguments.
     */
    private parseArgs(...args: unknown[]): {
        msg: string | undefined
        args: unknown[]
    } {
        let msg: string | undefined = undefined
        let data: unknown[] = args

        if (typeof args[0] === 'string') {
            msg = args[0]
            data = args.slice(1)
        } else if (args.length > 0 && typeof args[args.length - 1] === 'string') {
            msg = args[args.length - 1] as any
            data = args.slice(0, -1)
        }

        return { msg, args: data }
    }

    /**
     * Writes a log record at the specified level.
     * @param level - The severity level.
     * @param args - The log message and any additional data.
     * @returns A `Promise<void>` when using an {@link AsyncLogWriter}, otherwise `void`.
     */
    log(level: LogLevel, ...args: unknown[]): MaybePromise<Writer, void> {
        const { msg, args: _args } = this.parseArgs(...args)

        return this.writer.write({
            level,
            time: new Date(),
            tags: this.tags,
            message: msg,
            args: _args
        }) as MaybePromise<Writer, void>
    }

    /**
     * Writes a `TRACE` level log record.
     * @param args - The log message and any additional data.
     */
    trace(...args: unknown[]): MaybePromise<typeof this.writer, void> {
        return this.log(LogLevel.TRACE, ...args)
    }

    /**
     * Writes a `DEBUG` level log record.
     * @param args - The log message and any additional data.
     */
    debug(...args: unknown[]): MaybePromise<typeof this.writer, void> {
        return this.log(LogLevel.DEBUG, ...args)
    }

    /**
     * Writes an `INFO` level log record.
     * @param args - The log message and any additional data.
     */
    info(...args: unknown[]): MaybePromise<typeof this.writer, void> {
        return this.log(LogLevel.INFO, ...args)
    }

    /**
     * Writes a `WARN` level log record.
     * @param args - The log message and any additional data.
     */
    warn(...args: unknown[]): MaybePromise<typeof this.writer, void> {
        return this.log(LogLevel.WARN, ...args)
    }

    /**
     * Writes an `ERROR` level log record.
     * @param args - The log message and any additional data.
     */
    error(...args: unknown[]): MaybePromise<typeof this.writer, void> {
        return this.log(LogLevel.ERROR, ...args)
    }

    /**
     * Writes a `CRITICAL` level log record.
     * @param args - The log message and any additional data.
     */
    critical(...args: unknown[]): MaybePromise<typeof this.writer, void> {
        return this.log(LogLevel.CRITICAL, ...args)
    }
}
