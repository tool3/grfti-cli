import {
  color,
  gradient,
  NAMED_COLOR_NAMES,
  PRESET_NAMES,
  PRESETS,
  rgbToAnsi16,
  rgbToAnsi256,
  type ColorDepth,
  type ColorSpace,
  type Direction,
  type Gradient,
  type PresetName,
} from 'grfti';

export interface RenderRequest {
  readonly spec: string;
  readonly text: string;
  readonly direction?: Direction | undefined;
  readonly space?: ColorSpace | undefined;
  readonly reverse?: boolean | undefined;
  readonly background?: boolean | undefined;
  readonly depth?: ColorDepth | undefined;
  readonly output?: 'text' | 'css' | 'svg' | 'hex' | undefined;
  readonly steps?: number | undefined;
  readonly id?: string | undefined;
  readonly angle?: number | undefined;
}

const SWATCH = '█'.repeat(28);
const DOT = '●';

export const withFlags = (base: Gradient, request: RenderRequest): Gradient => {
  const directed = request.direction === undefined ? base : base[request.direction];
  const reversed = request.reverse === true ? directed.reverse : directed;
  const layered = request.background === true ? reversed.bg : reversed;
  const spaced = request.space === undefined ? layered : layered.space(request.space);
  return request.depth === undefined ? spaced : spaced.depth(request.depth);
};

export const render = (request: RenderRequest): string => {
  const value = withFlags(gradient(request.spec), request);

  switch (request.output ?? 'text') {
    case 'css':
      return value.css(request.angle === undefined ? {} : { angle: request.angle });
    case 'svg':
      return value.svg(request.id === undefined ? {} : { id: request.id });
    case 'hex':
      return value
        .sample(request.steps ?? 10)
        .map((sampled) => sampled.hex)
        .join('\n');
    case 'text':
      return value(request.text);
  }
};

const swatchFor = (name: PresetName, depth: ColorDepth | undefined): string =>
  withFlags(gradient(name), { spec: name, text: '', depth })(SWATCH);

export const listPresets = (depth?: ColorDepth): string =>
  PRESET_NAMES.map(
    (name) =>
      `  ${name.padEnd(11)} ${swatchFor(name, depth)}  ${PRESETS[name].colors.join(' ')}`,
  ).join('\n');

export const listColors = (depth?: ColorDepth, columns = 4): string => {
  const cell = (name: string): string => {
    const swatch = depth === undefined ? color(name) : color(name).depth(depth);
    return `${swatch(DOT)} ${name.padEnd(21)}`;
  };

  return NAMED_COLOR_NAMES.reduce<readonly string[]>(
    (rows, name, index) =>
      index % columns === 0
        ? [...rows, `  ${cell(name)}`]
        : [...rows.slice(0, -1), `${rows.at(-1) ?? ''}${cell(name)}`],
    [],
  )
    .map((row) => row.trimEnd())
    .join('\n');
};

const round = (value: number, places = 3): number => Number(value.toFixed(places));

export const describeColor = (input: string, depth?: ColorDepth): string => {
  const value = depth === undefined ? color(input) : color(input).depth(depth);
  const { rgb } = value;
  const { h, s, l } = value.hsl;
  const oklch = value.oklch;

  const rows: readonly (readonly [string, string])[] = [
    ['name', value.name ?? '-'],
    ['hex', value.hex],
    ['rgb', `rgb(${rgb.r} ${rgb.g} ${rgb.b}${rgb.alpha < 1 ? ` / ${round(rgb.alpha)}` : ''})`],
    ['hsl', `hsl(${round(h, 1)} ${round(s * 100, 1)}% ${round(l * 100, 1)}%)`],
    ['oklch', `oklch(${round(oklch.l)} ${round(oklch.c)} ${round(oklch.h, 1)})`],
    ['ansi256', String(rgbToAnsi256(rgb))],
    ['ansi16', String(rgbToAnsi16(rgb))],
    ['luminance', String(round(value.luminance))],
    ['on white', `${round(value.contrast('white'), 2)}:1`],
    ['on black', `${round(value.contrast('black'), 2)}:1`],
  ];

  return [
    `  ${value.bg(SWATCH)}`,
    '',
    ...rows.map(([label, text]) => `  ${label.padEnd(11)} ${text}`),
  ].join('\n');
};
