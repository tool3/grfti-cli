#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { GrftiError, type ColorDepth, type ColorSpace, type Direction } from 'grfti';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { describeColor, listColors, listPresets, render, type RenderRequest } from './render';
import { readStdin } from './stdin';

const DIRECTIONS = ['horizontal', 'vertical', 'diagonal'] as const;
const SPACES = ['oklab', 'oklch', 'hsl', 'hsv', 'rgb'] as const;
const DEPTHS = ['truecolor', 'ansi256', 'ansi16', 'none'] as const;

const parser = yargs(hideBin(process.argv))
  .scriptName('grfti')
  .usage('$0 [gradient] [text..]', 'Paint text with a gradient')
  .example('$0 sunset "hello world"', 'use a preset')
  .example('$0 "pink, cyan" "hello world"', 'use two colors')
  .example('$0 "gradient(green, yellow):reverse:vertical" -f banner.txt', 'use the full dsl')
  .example('figlet grfti | $0 vaporwave', 'read from a pipe')
  .example('$0 --list', 'preview every preset')
  .positional('gradient', {
    type: 'string',
    describe: 'Preset name, color list, or gradient(...) spec',
  })
  .positional('text', { type: 'string', array: true, describe: 'Text to paint' })
  .option('direction', {
    alias: 'd',
    choices: DIRECTIONS,
    describe: 'Which way the gradient runs',
  })
  .option('space', { alias: 's', choices: SPACES, describe: 'Interpolation space' })
  .option('reverse', { alias: 'r', type: 'boolean', describe: 'Flip the gradient' })
  .option('background', { alias: 'b', type: 'boolean', describe: 'Paint the background' })
  .option('depth', { alias: 'D', choices: DEPTHS, describe: 'Force a color depth' })
  .option('file', { alias: 'f', type: 'string', describe: 'Read the text from a file' })
  .option('css', { type: 'boolean', describe: 'Print a CSS linear-gradient' })
  .option('svg', { type: 'boolean', describe: 'Print an SVG <linearGradient>' })
  .option('hex', { type: 'boolean', describe: 'Print sampled hex values' })
  .option('steps', { alias: 'n', type: 'number', default: 10, describe: 'Samples for --hex' })
  .option('angle', { type: 'number', describe: 'Angle for --css' })
  .option('id', { type: 'string', describe: 'Element id for --svg' })
  .option('info', { alias: 'i', type: 'string', describe: 'Describe a single color' })
  .option('list', { alias: 'l', type: 'boolean', describe: 'Preview every preset' })
  .option('colors', { type: 'boolean', describe: 'Preview every named color' })
  .conflicts('css', ['svg', 'hex'])
  .conflicts('svg', 'hex')
  .check((args) => {
    const informational =
      args.list === true || args.colors === true || typeof args.info === 'string';
    if (!informational && typeof args.gradient !== 'string') {
      throw new Error(
        'Give me a gradient: a preset name, a color list, or a gradient(...) spec. Try --list.',
      );
    }
    return true;
  })
  .wrap(Math.min(100, process.stdout.columns ?? 100))
  .help()
  .alias('help', 'h')
  .version()
  .alias('version', 'V');

type Arguments = Awaited<ReturnType<typeof parser.parse>>;

const outputOf = (args: Arguments): RenderRequest['output'] =>
  args.css === true ? 'css' : args.svg === true ? 'svg' : args.hex === true ? 'hex' : 'text';

const textOf = async (args: Arguments): Promise<string> => {
  if (typeof args.file === 'string') return readFile(args.file, 'utf8');

  const positional = (args.text ?? []) as readonly string[];
  return positional.length > 0 ? positional.join(' ') : (await readStdin()).replace(/\n$/, '');
};

const requestOf = async (args: Arguments): Promise<RenderRequest> => ({
  spec: String(args.gradient ?? ''),
  text: await textOf(args),
  direction: args.direction as Direction | undefined,
  space: args.space as ColorSpace | undefined,
  reverse: args.reverse,
  background: args.background,
  depth: args.depth as ColorDepth | undefined,
  output: outputOf(args),
  steps: args.steps,
  angle: args.angle,
  id: args.id,
});

const run = async (): Promise<string> => {
  const args = await parser.parseAsync();
  const depth = args.depth as ColorDepth | undefined;

  if (args.list === true) return listPresets(depth);
  if (args.colors === true) return listColors(depth);
  if (typeof args.info === 'string') return describeColor(args.info, depth);

  return render(await requestOf(args));
};

const fail = (error: unknown): never => {
  const message = error instanceof GrftiError || error instanceof Error ? error.message : String(error);
  process.stderr.write(`grfti: ${message}\n`);
  process.exit(1);
};

run().then(
  (output) => process.stdout.write(`${output}\n`),
  (error: unknown) => fail(error),
);
