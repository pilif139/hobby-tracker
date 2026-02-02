import type { LogEntry, Transport } from './logger';

export class ConsoleTransport implements Transport {
  log(entry: LogEntry) {
    const { level, message, context, timestamp } = entry;

    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    switch (level) {
      case 'debug':
        console.debug(`\x1b[1;35m${prefix}\x1b[0m`, message, context ?? '');
        break;
      case 'info':
        console.info(`\x1b[1;34m${prefix}\x1b[0m`, message, context ?? '');
        break;
      case 'warn':
        console.warn(`\x1b[1;33m${prefix}\x1b[0m`, message, context ?? '');
        break;
      case 'error':
        console.error(`\x1b[1;31m${prefix}\x1b[0m`, message, context ?? '');
        break;
    }
  }
}
