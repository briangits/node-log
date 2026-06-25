/**
 * Defines the severity levels for log records.
 *
 * Levels are ordered by increasing severity:
 * `TRACE` < `DEBUG` < `INFO` < `WARN` < `ERROR` < `CRITICAL`.
 */
export enum LogLevel {
    /** Fine-grained informational events useful for deep debugging. */
    TRACE = 10,

    /** Informational events useful for debugging an application. */
    DEBUG = 20,

    /** Informational messages that highlight the progress of the application. */
    INFO = 30,

    /** Potentially harmful situations that do not prevent execution. */
    WARN = 40,

    /** Error events that might still allow the application to continue running. */
    ERROR = 50,

    /** Very severe error events that will presumably lead the application to abort. */
    CRITICAL = 60
}
