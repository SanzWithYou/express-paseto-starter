import { createApp } from './app'
import { env } from './config'
import logger from './logger'

const start = async () => {
  try {
    logger.info('starting server...')

    const app = await createApp()

    const server = app.listen(env.port, () => {
      logger.info(`server running on port ${env.port} [${env.nodeEnv}]`)
    })

    const shutdown = (signal: string) => {
      logger.info(`received ${signal}, shutting down...`)

      server.close(() => {
        logger.info('server closed gracefully')
        process.exit(0)
      })
    }

    process.on('SIGTERM', () => shutdown('SIGTERM'))
    process.on('SIGINT', () => shutdown('SIGINT'))

    process.on('unhandledRejection', (reason: unknown) => {
      logger.error('unhandled rejection', { reason })
    })

    process.on('uncaughtException', (error: Error) => {
      logger.error('uncaught exception', { error })
      process.exit(1)
    })
  } catch (error) {
    logger.error('failed to start server', { error })
    process.exit(1)
  }
}

start()
