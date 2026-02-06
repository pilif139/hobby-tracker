import type { LogEntry, Transport } from './logger';
import fs from 'fs';

export class FileTransport implements Transport {
  constructor(private readonly directory: string) {}

  async log(entry: LogEntry): Promise<void> {
    const { level, message, context, timestamp } = entry;

    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    const filePath = `${this.directory}/${timestamp}.log`;
    await fs.promises.appendFile(
      filePath,
      `${prefix} ${message} ${context ? JSON.stringify(context) : ''}\n`,
    );
  }
}
