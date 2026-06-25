import { LogLevel } from '../LogLevel'
import { LogRecord } from '../LogRecord'
import { LogWriter } from './LogWriter'

/**
 * A synchronous log writer that outputs formatted log records
 * to the console. Supports customizable format strings
 * using placeholders: `%t` (timestamp), `%l` (level), `%tag` (tags), `%msg` (message).
 */
export class ConsoleLogWriter implements LogWriter {
    /**
     * Creates a new `ConsoleLogWriter` instance.
     * @param format - The format string. Defaults to `[%t] [%l] [%tag]: %msg`.
     */
    constructor(private readonly format: string = '[%t] [%l] [%tag]: %msg') {}

    /**
     * Formats a `LogRecord` into an array suitable for `console.log`.
     * @param log - The log record to format.
     * @returns An array of formatted values and extras.
     */
    private fmt(log: LogRecord): unknown[] {
        const tag = log.tags.length > 0 ? `[${log.tags.join('/')}]` : ''

        return [
            this.format
                .replace('%t', log.time.toISOString())
                .replace('%l', LogLevel[log.level])
                .replace('%tag', tag)
                .replace('%msg', log.message ?? '')
                .trim(),
            ...log.args
        ]
    }

    /**
     * Writes a log record to the console.
     * @param log - The log record to write.
     */
    write(log: LogRecord): void {
        console.log(...this.fmt(log))
    }
}
