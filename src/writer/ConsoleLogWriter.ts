import { LogLevel } from '../LogLevel'
import { LogRecord } from '../LogRecord'
import { LogWriter } from './LogWriter'

export class ConsoleLogWriter implements LogWriter {
    constructor(private readonly format: string = '[%t] [%l] [%tag]: %msg') {}

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

    write(log: LogRecord): void {
        console.log(...this.fmt(log))
    }
}
