import { appendFile } from 'node:fs/promises'
import { LogRecord } from '../LogRecord'
import { AsyncLogWriter } from './AsyncLogWriter'

/**
 * An asynchronous log writer that serializes log records as JSON Lines
 * and appends them to a file. Special values like `Error`, `Map`, `Set`,
 * and `bigint` are normalized before serialization.
 */
export class JSONLFileLogWriter implements AsyncLogWriter {
    /**
     * Creates a new `JSONLFileLogWriter` instance.
     * @param path - The path to the JSON Lines file.
     */
    constructor(private readonly path: string) {}

    /**
     * Serializes a `LogRecord` into a plain object.
     * @param log - The log record to serialize.
     * @returns A plain object representation of the log record.
     * @private
     */
    private serialize(log: LogRecord): object {
        return {
            ...log,
            args: log.args.map(arg => this.serializeValue(arg))
        }
    }

    /**
     * Serializes the `value` to a plain object
     * @param value - The value to serialize.
     * @return A plain object representation of the value.
     * @private
     */
    private serializeValue(value: unknown): unknown {
        if (value instanceof Error) {
            return {
                name: value.name,
                message: value.message,
                stack: value.stack
            }
        }

        if (value instanceof Map) {
            return Object.fromEntries(value)
        }

        if (value instanceof Set) {
            return [...value]
        }

        if (typeof value === 'bigint') {
            return value.toString()
        }

        return value
    }

    /**
     * Writes a log record to the log file.
     * @param log - The log record to write.
     */
    async write(log: LogRecord): Promise<void> {
        await appendFile(this.path, JSON.stringify(this.serialize(log)) + '\n')
    }
}
