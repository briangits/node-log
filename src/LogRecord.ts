import { LogLevel } from './LogLevel'

export interface LogRecord {
    level: LogLevel
    time: Date
    tags: string[]
    message: string | undefined
    args: unknown[]
}
