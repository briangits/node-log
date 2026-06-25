import { LogLevel } from './LogLevel'

/**
 * Represents a single log record containing metadata, the message,
 * and any additional arguments.
 */
export interface LogRecord {
    /** The level of the log. */
    level: LogLevel
    /** The timestamp when the log record was created. */
    time: Date
    /** The tags associated with the log record. */
    tags: string[]
    /** The log message, if any. */
    message: string | undefined
    /** Additional arguments passed to the log. */
    args: unknown[]
}
