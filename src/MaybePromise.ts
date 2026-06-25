import { AsyncLogWriter, LogWriter } from './writer'

/**
 * A conditional type that resolves to `Promise<R>` when the writer is
 * an {@link AsyncLogWriter}, otherwise `R`.
 *
 * @typeParam Writer - The writer type to check.
 * @typeParam R - The return type of the operation.
 */
export type MaybePromise<
    Writer extends LogWriter | AsyncLogWriter,
    R
> = Writer extends AsyncLogWriter ? Promise<R> : R
