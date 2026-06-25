import { LogLevel } from './LogLevel'

/**
 * Configuration options for a {@link Logger} instance.
 */
export interface LoggerConfig {
    /** Tags to attach to every log record. */
    tags: string[]
    /** Minimum log level. Records below this level are silently dropped. */
    level: LogLevel
}

/**
 * Default logger configuration.
 *
 * - `tags`: `[]`
 * - `level`: {@link LogLevel.INFO}
 */
export const DefaultLoggerConfig: LoggerConfig = {
    tags: [],
    level: LogLevel.INFO
}
