declare module 'bun:sqlite' {
  export class Database {
    constructor(
      filename: string,
      options?: {
        create?: boolean;
        strict?: boolean;
      },
    );
    prepare(query: string): any;
    run(sql: string): { lastInsertRowid: number; changes: number };
    serialize(): Uint8Array;
    close(throwOnError?: boolean): void;
  }
}
