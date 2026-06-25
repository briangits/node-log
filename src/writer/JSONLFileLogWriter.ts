import { appendFile } from 'node:fs/promises'
import { LogRecord } from '../LogRecord'
import { AsyncLogWriter } from './AsyncLogWriter'

export class JSONLFileLogWriter implements AsyncLogWriter {
    constructor(private readonly path: string) {}

    private serialize(log: LogRecord): object {
        return {
            ...log,
            args: log.args.map(arg => this.serializeValue(arg))
        }
    }

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

    async write(log: LogRecord): Promise<void> {
        await appendFile(this.path, JSON.stringify(this.serialize(log)) + '\n')
    }
}
