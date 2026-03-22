type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  timestamp: string;
}

export interface Transport {
  log(entry: LogEntry): Promise<void> | void;
}

type Environment = 'development' | 'production';

type WaitUntilFn = (promise: Promise<unknown>) => void;

export interface LoggerOptions {
  environment?: Environment;
  transports?: Transport[];
  waitUntil?: WaitUntilFn;
}

export class Logger {
  private transports: Transport[];
  private environment: Environment;
  private waitUntil?: WaitUntilFn;

  constructor(options?: LoggerOptions) {
    this.environment = options?.environment || 'development';
    this.transports = options?.transports || [];
    this.waitUntil = options?.waitUntil;
    if (!this.transports.length) {
      console.warn(
        'You are creating a logger without any transports. This logger will not log any messages.',
      );
    }
  }

  setWaitUntil(waitUntil: WaitUntilFn): void {
    this.waitUntil = waitUntil;
  }

  private makeEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
  ): LogEntry {
    return {
      level,
      message,
      context,
      timestamp: new Date().toISOString(),
    };
  }

  private async emitAsync(entry: LogEntry): Promise<void> {
    await Promise.all(
      this.transports.map(async (t) => {
        try {
          await t.log(entry);
        } catch (error) {
          console.error(`Error logging entry: ${error}`);
        }
      }),
    );
  }

  private emit(entry: LogEntry): void {
    const promise = this.emitAsync(entry);

    // if there is a waitUntil function, wait for it to resolve before continuing
    if (this.waitUntil) {
      this.waitUntil(promise);
    } else {
      promise.catch((error) => {
        console.error(`Unhandled error in logger emit: ${error}`);
      });
    }
  }

  debug(message: string, context?: Record<string, unknown>): void {
    const entry = this.makeEntry('debug', message, context);
    this.emit(entry);
  }

  info(message: string, context?: Record<string, unknown>): void {
    const entry = this.makeEntry('info', message, context);
    this.emit(entry);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    const entry = this.makeEntry('warn', message, context);
    this.emit(entry);
  }

  error(message: string, context?: Record<string, unknown>): void {
    const entry = this.makeEntry('error', message, context);
    this.emit(entry);
  }

  async flush(entry: LogEntry): Promise<void> {
    await this.emitAsync(entry);
  }
}
