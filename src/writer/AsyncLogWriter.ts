import { LogRecord } from '../LogRecord'

/**
 * Defines an asynchronous log writer that accepts log records
 * and writes them to a target output (console, file, etc.).
 */
export interface AsyncLogWriter {
    /**
     * Writes a single log record asynchronously.
     * @param log - The log record to write.
     */
    write(log: LogRecord): Promise<void>
}
