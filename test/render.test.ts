import { PRESET_NAMES } from 'grfti';
import { describe, expect, test } from 'vitest';
import { describeColor, listColors, listPresets, render, withFlags } from '../src/render';
import { gradient } from 'grfti';

const ESC = String.fromCharCode(27);
const strip = (text: string): string => text.replaceAll(new RegExp(`${ESC}\\[[0-9;]*m`, 'g'), '');

describe('render', () => {
  test('paints text with a preset', () => {
    const output = render({ spec: 'sunset', text: 'hello', depth: 'truecolor' });
    expect(strip(output)).toBe('hello');
    expect(output).toContain(`${ESC}[38;2;255;122;89m`);
  });

  test('paints text with a color list', () => {
    expect(strip(render({ spec: 'pink, cyan', text: 'hello', depth: 'truecolor' }))).toBe('hello');
  });

  test('accepts the full dsl', () => {
    const output = render({
      spec: 'gradient(green, yellow):reverse:vertical',
      text: 'one\ntwo',
      depth: 'truecolor',
    });
    expect(strip(output)).toBe('one\ntwo');
    expect(output.split('\n')[0]).toContain('255;255;0');
  });

  test('honours the flag options', () => {
    expect(render({ spec: 'pink, cyan', text: 'hi', depth: 'none' })).toBe('hi');
    expect(
      render({ spec: 'pink, cyan', text: 'hi', depth: 'truecolor', background: true }),
    ).toContain(`${ESC}[48;2;`);
    expect(
      render({ spec: 'pink, cyan', text: 'hi', depth: 'ansi256' }).includes(`${ESC}[38;5;`),
    ).toBe(true);
  });

  test('emits css', () => {
    expect(render({ spec: 'pink, cyan', text: '', output: 'css' })).toBe(
      'linear-gradient(90deg, #ffc0cb 0%, #00ffff 100%)',
    );
    expect(render({ spec: 'pink, cyan', text: '', output: 'css', direction: 'vertical' })).toBe(
      'linear-gradient(180deg, #ffc0cb 0%, #00ffff 100%)',
    );
    expect(render({ spec: 'pink, cyan', text: '', output: 'css', angle: 45 })).toContain('45deg');
  });

  test('emits svg', () => {
    const output = render({ spec: 'pink, cyan', text: '', output: 'svg', id: 'bg' });
    expect(output).toContain('<linearGradient id="bg"');
    expect(output).toContain('stop-color="#ffc0cb"');
  });

  test('emits sampled hex values', () => {
    const output = render({ spec: 'red, blue', text: '', output: 'hex', steps: 3 });
    expect(output.split('\n')).toEqual(['#ff0000', '#8c53a2', '#0000ff']);
  });

  test('defaults to ten samples', () => {
    expect(render({ spec: 'red, blue', text: '', output: 'hex' }).split('\n')).toHaveLength(10);
  });
});

describe('withFlags', () => {
  test('applies each flag and leaves the rest alone', () => {
    const base = gradient('pink', 'cyan');
    expect(withFlags(base, { spec: '', text: '', direction: 'diagonal' }).direction).toBe('diagonal');
    expect(withFlags(base, { spec: '', text: '', reverse: true }).colors[0]?.hex).toBe('#00ffff');
    expect(withFlags(base, { spec: '', text: '', space: 'rgb' }).at(0.5).hex).toBe('#80e0e5');
    expect(base.direction).toBe('horizontal');
  });
});

describe('listings', () => {
  test('lists every preset with a swatch and its colors', () => {
    const lines = listPresets('truecolor').split('\n');
    expect(lines).toHaveLength(PRESET_NAMES.length);
    expect(strip(lines[0] ?? '')).toMatch(/^ {2}atlas {7}█+ {2}#feac5e #c779d0 #4bc0c8$/);
  });

  test('lists named colors in columns', () => {
    const output = listColors('truecolor', 4);
    expect(strip(output).split('\n')[0]?.trim().split(/\s+/)).toHaveLength(8);
    expect(output).toContain('aliceblue');
    expect(output).toContain('yellowgreen');
  });
});

describe('describeColor', () => {
  test('reports every representation of a color', () => {
    const output = strip(describeColor('hotpink', 'truecolor'));
    expect(output).toContain('name        hotpink');
    expect(output).toContain('hex         #ff69b4');
    expect(output).toContain('rgb         rgb(255 105 180)');
    expect(output).toContain('ansi256     205');
    expect(output).toMatch(/on white {4}\d+(\.\d+)?:1/);
  });

  test('shows alpha when there is any', () => {
    expect(strip(describeColor('#ff000080', 'truecolor'))).toContain('rgb(255 0 0 / 0.502)');
  });

  test('has no name for an unnamed color', () => {
    expect(strip(describeColor('#123456', 'truecolor'))).toContain('name        -');
  });
});
