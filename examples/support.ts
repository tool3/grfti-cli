import { execSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { gradient } from 'grfti'
import { shellfie, themes } from 'shellfie'
import type { Theme } from 'shellfie'

const root = resolve(__dirname, '..')
const cli = join(root, 'dist', 'cli.js')
const outputs = join(__dirname, 'svgs')

const RESET = '\x1b[0m'

export const dim = (text: string): string => `\x1b[38;5;243m${text}${RESET}`
export const bright = (text: string): string => `\x1b[1;97m${text}${RESET}`

export const blank = ''
export const heading = (text: string): string => bright(`  ${text}`)
export const note = (text: string): string => `  ${dim(text)}`

const PROMPT = `\x1b[38;2;94;231;223m❯${RESET}`

const captured = (error: unknown): string => {
  const failure = error as { stdout?: unknown; stderr?: unknown }
  return `${String(failure.stdout ?? '')}${String(failure.stderr ?? '')}`
}

const { FORCE_COLOR: _forced, NO_COLOR: _disabled, ...ambient } = process.env

// stderr is merged into stdout so failures land in the transcript where a terminal would show them
const execute = (command: string, forceColor: boolean): string => {
  const script = `grfti() { node ${JSON.stringify(cli)} "$@"; }\nexec 2>&1\n${command}`
  const env = forceColor ? { ...ambient, FORCE_COLOR: '3' } : ambient

  try {
    return execSync(script, {
      shell: '/bin/bash',
      cwd: __dirname,
      encoding: 'utf8',
      env: { ...env, COLUMNS: '100' },
      stdio: ['pipe', 'pipe', 'pipe'],
    })
  } catch (error) {
    return captured(error)
  }
}

const transcript = (command: string, output: string): readonly string[] => {
  const [first = '', ...rest] = command.split('\n')
  const echoed = [`  ${PROMPT} ${bright(first)}`, ...rest.map((line) => `    ${bright(line)}`)]
  const printed = output.replace(/\n+$/, '')

  return [...echoed, ...(printed === '' ? [] : printed.split('\n').map((line) => `  ${line}`)), blank]
}

export const run = (command: string): readonly string[] =>
  transcript(command, execute(command, true))

export const bare = (command: string): readonly string[] =>
  transcript(command, execute(command, false))

const backdrop = (source: string, direction = 'diagonal'): string =>
  `gradient(${gradient(source)
    .sample(3)
    .map((sampled) => sampled.hex.slice(0, 7))
    .join(', ')}:${direction})`

export interface Example {
  readonly title: string
  readonly lines: readonly string[]
  readonly palette?: string
  readonly theme?: Theme
}

export const save = (name: string, example: Example): void => {
  const svg = shellfie(example.lines.join('\n'), {
    template: 'macos',
    theme: example.theme ?? themes.dark,
    title: `grfti — ${example.title}`,
    language: false,
    fontSize: 14,
    lineHeight: 1.45,
    padding: 22,
    customGlyphs: true,
    background: { color: backdrop(example.palette ?? 'midnight'), padding: 44, borderRadius: 18 },
    watermark: dim('grfti-cli + shellfie'),
  })

  mkdirSync(outputs, { recursive: true })
  writeFileSync(join(outputs, `${name}.svg`), svg)
  console.log(`  ${name.padEnd(18)} svgs/${name}.svg`)
}
