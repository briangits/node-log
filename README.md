# node-log

> Logging for Node.js with typed writers, log levels, and structured output.

## Features

- **Sync & Async Writers** — Log to the console synchronously or to files asynchronously.
- **Log Levels** — `TRACE`, `DEBUG`, `INFO`, `WARN`, `ERROR`, `CRITICAL`.
- **Level Filtering** — Skip low-priority records below a configurable threshold.
- **Tags** — Attach contextual tags to every log record and create child loggers with more tags.
- **Structured Output** — Built-in JSON Lines writer with automatic serialization of `Error`, `Map`, `Set`, and `bigint`.
- **Customizable Formatting** — Console writer supports format strings with placeholders.
- **TypeScript First** — Fully typed with declaration maps.
- **Dual Format** — Ships both ESM and CJS builds.

## Installation

```bash
# pnpm
pnpm add @briangits/node-log

# npm
npm install @briangits/node-log

# yarn
yarn add @briangits/node-log
```

## Quick Start

```typescript
import { Logger, ConsoleLogWriter } from '@briangits/node-log'

const logger = new Logger(new ConsoleLogWriter())

logger.info('Server started on port', 3000)
logger.warn('High memory usage', { used: '1.2GB' })
logger.error('Connection failed', new Error('timeout'))
```

**Console output:**

```
[2026-06-25T06:30:00.000Z] [INFO]: Server started on port 3000
[2026-06-25T06:30:00.001Z] [WARN]: High memory usage { used: '1.2GB' }
[2026-06-25T06:30:00.002Z] [ERROR]: Connection failed Error: timeout
```

## Configuration

`Logger` accepts a partial `LoggerConfig` object as its second argument. Unspecified options fall back to `DefaultLoggerConfig`.

```typescript
import { Logger, ConsoleLogWriter, LogLevel } from '@briangits/node-log'

const logger = new Logger(new ConsoleLogWriter(), {
    level: LogLevel.WARN,
    tags: ['app']
})

logger.info('ignored')   // below WARN, silently dropped
logger.warn('visible')   // written with tag [app]
```

### `LoggerConfig`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `level` | `LogLevel` | `LogLevel.INFO` | Minimum level to output. Records below this are discarded. |
| `tags` | `string[]` | `[]` | Tags attached to every record. |

### Child Loggers with `tag()`

Use `tag()` to create a new logger that inherits the current configuration and appends additional tags.

```typescript
const http = logger.tag('http')

http.info('request received')
// => tags: ['app', 'http']

const db = logger.tag('db')
db.error('connection timeout')
// => tags: ['app', 'db']
```

## Writers

Writers are the target destination for log records. The library provides two built-in writers and a simple interface for creating your own.

### ConsoleLogWriter

Outputs formatted log records to `stdout`.

```typescript
import { Logger, ConsoleLogWriter } from '@briangits/node-log'

const logger = new Logger(new ConsoleLogWriter('[%t] %l — %msg'))

logger.info('Hello, world!')
// => [2026-06-25T06:30:00.000Z] INFO — Hello, world!
```

**Message extraction:**

- If the **first** argument is a string, it is used as the message.
- Otherwise, if the **last** argument is a string, it is used as the message.
- Any remaining arguments are passed through as additional data.

**Format placeholders:**

| Placeholder | Description                                     |
| ----------- | ----------------------------------------------- |
| `%t`        | ISO timestamp                                   |
| `%l`        | Log level name (e.g., `INFO`)                   |
| `%tag`      | Tags joined by `/` (omitted if no tags are set) |
| `%msg`      | Log message                                     |

Additional arguments are appended after the formatted message and passed directly to `console.log`.

### JSONLFileLogWriter

Appends log records as JSON Lines to a file. Automatically normalizes special values so they remain serializable.

```typescript
import { Logger, JSONLFileLogWriter } from '@briangits/node-log'

const logger = new Logger(new JSONLFileLogWriter('./app.log'))

await logger.info('User logged in', { userId: 42 })
```

**Serialized output (`./app.log`):**

```json
{
    "level": 30,
    "time": "2026-06-25T06:30:00.000Z",
    "tags": [],
    "message": "User logged in",
    "args": [{ "userId": 42 }]
}
```

**Normalization rules:**

| Type     | Serialized as                         |
| -------- | ------------------------------------- |
| `Error`  | `{ name, message, stack }`            |
| `Map`    | Plain object via `Object.fromEntries` |
| `Set`    | Array via `[...set]`                  |
| `bigint` | String via `.toString()`              |

### Custom Writer

Implement `LogWriter` for synchronous output or `AsyncLogWriter` for asynchronous output.

```typescript
import { LogWriter, LogRecord, Logger } from '@briangits/node-log'

class SyslogWriter implements LogWriter {
    write(log: LogRecord): void {
        // forward to syslog, etc.
    }
}

const logger = new Logger(new SyslogWriter())
logger.info('Sent to syslog')
```

## API Reference

### `Logger<Writer>`

The main entry point for creating log records.

```typescript
new Logger(writer: Writer, config?: Partial<LoggerConfig>)
```

| Method                | Description                                                             |
| --------------------- | ----------------------------------------------------------------------- |
| `log(level, ...args)` | Write a record at the given `LogLevel`. Ignored when below the minimum. |
| `trace(...args)`      | Write a `TRACE` record.                                                 |
| `debug(...args)`      | Write a `DEBUG` record.                                                 |
| `info(...args)`       | Write an `INFO` record.                                                 |
| `warn(...args)`       | Write a `WARN` record.                                                  |
| `error(...args)`      | Write an `ERROR` record.                                                |
| `critical(...args)`   | Write a `CRITICAL` record.                                              |
| `tag(...tags)`        | Returns a new `Logger` with the additional tags appended.               |

When the writer is an `AsyncLogWriter`, all methods return `Promise<void>`; otherwise they return `void`.

### `LogLevel`

```typescript
enum LogLevel {
    TRACE = 10,
    DEBUG = 20,
    INFO = 30,
    WARN = 40,
    ERROR = 50,
    CRITICAL = 60
}
```

### `LogRecord`

```typescript
interface LogRecord {
    level: LogLevel
    time: Date
    tags: string[]
    message: string | undefined
    args: unknown[]
}
```

### `LoggerConfig`

```typescript
interface LoggerConfig {
    tags: string[]
    level: LogLevel
}
```

## License

Apache-2.0
