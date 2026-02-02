import type { LogEntry, Transport } from './logger';

export class ConsoleTransport implements Transport {
  log(entry: LogEntry) {
    const { level, message, context, timestamp } = entry;

    console.log(`${timestamp} [${level}] ${message}`);
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    switch (level) {
      case 'debug':
        console.debug(prefix, message, context);
        break;
      case 'info':
        console.info(prefix, message, context);
        break;
      case 'warn':
        console.warn(prefix, message, context);
        break;
      case 'error':
        console.error(prefix, message, context);
        break;
    }
  }
}
