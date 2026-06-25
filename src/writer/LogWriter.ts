import { LogRecord } from '../LogRecord'

export interface LogWriter {
    write(log: LogRecord): void
}
