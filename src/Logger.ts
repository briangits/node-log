import { LogLevel } from './LogLevel'
import { MaybePromise } from './MaybePromise'
import { AsyncLogWriter, LogWriter } from './writer'

export class Logger<Writer extends LogWriter | AsyncLogWriter = LogWriter> {
    constructor(
        private readonly writer: Writer,
        private readonly tags: string[] = []
    ) {}

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

    trace(...args: unknown[]): MaybePromise<typeof this.writer, void> {
        return this.log(LogLevel.TRACE, ...args)
    }

    debug(...args: unknown[]): MaybePromise<typeof this.writer, void> {
        return this.log(LogLevel.DEBUG, ...args)
    }

    info(...args: unknown[]): MaybePromise<typeof this.writer, void> {
        return this.log(LogLevel.INFO, ...args)
    }

    warn(...args: unknown[]): MaybePromise<typeof this.writer, void> {
        return this.log(LogLevel.WARN, ...args)
    }

    error(...args: unknown[]): MaybePromise<typeof this.writer, void> {
        return this.log(LogLevel.ERROR, ...args)
    }

    critical(...args: unknown[]): MaybePromise<typeof this.writer, void> {
        return this.log(LogLevel.CRITICAL, ...args)
    }
}
