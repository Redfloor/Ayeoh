declare module 'mic' {
  import type { Readable } from 'stream';

  interface MicOptions {
    rate?: string;
    channels?: string;
    debug?: boolean;
    exitOnSilence?: number;
    device?: string;
  }

  interface MicInstance {
    start(): void;
    stop(): void;
    pause(): void;
    resume(): void;
    getAudioStream(): Readable;
  }

  export default function mic(options?: MicOptions): MicInstance;
}
