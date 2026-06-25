import { AsyncLogWriter, LogWriter } from './writer'

export type MaybePromise<
    Writer extends LogWriter | AsyncLogWriter,
    R
> = Writer extends AsyncLogWriter ? Promise<R> : R
