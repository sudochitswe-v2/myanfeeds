declare module 'html-truncate' {
  interface TruncateOptions {
    suffix?: string;
  }

  function truncate(input: string, length: number, options?: TruncateOptions): string;

  export = truncate;
}