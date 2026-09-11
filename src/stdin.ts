import { text } from 'node:stream/consumers';

export const readStdin = async (): Promise<string> =>
  process.stdin.isTTY === true ? '' : text(process.stdin);
