import { LogRecord } from '../LogRecord'

/**
 * Defines a synchronous log writer that accepts log records
 * and writes them to a target output (console, file, etc.).
 */
export interface LogWriter {
    /**
     * Writes a single log record synchronously.
     * @param log - The log record to write.
     */
    write(log: LogRecord): void
}
