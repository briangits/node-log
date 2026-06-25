import { LogRecord } from '../LogRecord'

export interface AsyncLogWriter {
    write(log: LogRecord): Promise<void>
}
