import type { LogEntry, Transport } from './logger';

export class ConsoleTransport implements Transport {
  constructor(private options: { colorize?: boolean } = { colorize: true }) {}

  log(entry: LogEntry) {
    const { level, message, context, timestamp } = entry;

    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    const colorize = this.options.colorize ?? true;

    switch (level) {
      case 'debug':
        console.debug(
          colorize ? `\x1b[1;35m${prefix}\x1b[0m` : prefix,
          message,
          context ?? '',
        );
        break;
      case 'info':
        console.info(
          colorize ? `\x1b[1;34m${prefix}\x1b[0m` : prefix,
          message,
          context ?? '',
        );
        break;
      case 'warn':
        console.warn(
          colorize ? `\x1b[1;33m${prefix}\x1b[0m` : prefix,
          message,
          context ?? '',
        );
        break;
      case 'error':
        console.error(
          colorize ? `\x1b[1;31m${prefix}\x1b[0m` : prefix,
          message,
          context ?? '',
        );
        break;
    }
  }
}
