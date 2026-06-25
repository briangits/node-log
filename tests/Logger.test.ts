import { describe, expect, it, vi } from 'vitest'
import { AsyncLogWriter, Logger, LogLevel, LogWriter } from '../src'

describe('Logger', () => {
    describe('with sync writer', () => {
        it('should write a log record with the given level', () => {
            const writer: LogWriter = { write: vi.fn() }
            const logger = new Logger(writer)

            logger.log(LogLevel.INFO, 'hello')

            expect(writer.write).toHaveBeenCalledWith({
                level: LogLevel.INFO,
                time: expect.any(Date),
                tags: [],
                message: 'hello',
                args: []
            })
        })

        it('should use the first string arg as the message', () => {
            const writer: LogWriter = { write: vi.fn() }
            const logger = new Logger(writer)

            logger.info('first', 'second', 42)

            expect(writer.write).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'first',
                    args: ['second', 42]
                })
            )
        })

        it('should use the last string arg as the message when first is not a string', () => {
            const writer: LogWriter = { write: vi.fn() }
            const logger = new Logger(writer)

            logger.info(42, 'last')

            expect(writer.write).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'last',
                    args: [42]
                })
            )
        })

        it('should leave message undefined when no string arg is provided', () => {
            const writer: LogWriter = { write: vi.fn() }
            const logger = new Logger(writer)

            logger.info(42, true)

            expect(writer.write).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: undefined,
                    args: [42, true]
                })
            )
        })

        it('should pass through custom tags', () => {
            const writer: LogWriter = { write: vi.fn() }
            const logger = new Logger(writer, ['app', 'http'])

            logger.warn('slow request')

            expect(writer.write).toHaveBeenCalledWith(
                expect.objectContaining({
                    tags: ['app', 'http']
                })
            )
        })

        it('should return void for sync writer', () => {
            const writer: LogWriter = { write: vi.fn() }
            const logger = new Logger(writer)

            const result = logger.debug('test')

            expect(result).toBeUndefined()
        })
    })

    describe('level shortcuts', () => {
        it.each([
            ['trace', LogLevel.TRACE],
            ['debug', LogLevel.DEBUG],
            ['info', LogLevel.INFO],
            ['warn', LogLevel.WARN],
            ['error', LogLevel.ERROR],
            ['critical', LogLevel.CRITICAL]
        ] as const)('%s should call log with %i', (method, level) => {
            const writer: LogWriter = { write: vi.fn() }
            const logger = new Logger(writer)

            ;(logger[method] as (...args: unknown[]) => void)('msg')

            expect(writer.write).toHaveBeenCalledWith(
                expect.objectContaining({
                    level,
                    message: 'msg'
                })
            )
        })
    })

    describe('with async writer', () => {
        it('should return a promise for async writer', async () => {
            const writer: AsyncLogWriter = { write: vi.fn().mockResolvedValue(undefined) }
            const logger = new Logger(writer)

            const result = logger.info('async')

            expect(result).toBeInstanceOf(Promise)
            await expect(result).resolves.toBeUndefined()
        })

        it('should write a log record asynchronously', async () => {
            const writer: AsyncLogWriter = { write: vi.fn().mockResolvedValue(undefined) }
            const logger = new Logger(writer)

            await logger.error('something went wrong')

            expect(writer.write).toHaveBeenCalledWith({
                level: LogLevel.ERROR,
                time: expect.any(Date),
                tags: [],
                message: 'something went wrong',
                args: []
            })
        })
    })
})
