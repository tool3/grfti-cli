# grfti-cli

Spray color and gradients across your terminal, from the command line. The CLI for [grfti](https://github.com/tool3/grfti).

```sh
npm install -g grfti-cli
```

```sh
grfti sunset "hello world"
grfti "pink, cyan" "hello world"
grfti "gradient(green, yellow):reverse:vertical" -f banner.txt
figlet grfti | grfti vaporwave
grfti --list
```

<p align="center">
  <a href="./examples/swatches.ts">
    <img src="https://raw.githubusercontent.com/tool3/grfti-cli/master/examples/svgs/swatches.svg" width="560" alt="block swatches, three directions">
  </a>
</p>

Every picture on this page is a transcript: the command shown is the command that ran, and
what you see under it is exactly what it printed —
[shellfie](https://github.com/tool3/shellfie) turned the captured buffer into SVG.

## Usage

```
grfti [gradient] [text..]
```

The first argument is the gradient: a preset name, a comma-separated color list, or a full
`gradient(...)` spec. The rest is the text — or pipe it in on stdin, or point at a file with
`-f`.

<a href="./examples/paint.ts"><img src="https://raw.githubusercontent.com/tool3/grfti-cli/master/examples/svgs/paint.svg" width="720" alt="paint"></a>

| Option | |
| --- | --- |
| `-d, --direction` | `horizontal`, `vertical`, `diagonal` |
| `-s, --space` | `oklab`, `oklch`, `hsl`, `hsv`, `rgb` |
| `-r, --reverse` | Flip the gradient |
| `-b, --background` | Paint the background instead of the text |
| `-D, --depth` | Force `truecolor`, `ansi256`, `ansi16` or `none` |
| `-f, --file` | Read the text from a file |
| `--css` | Print a CSS `linear-gradient()` |
| `--svg` | Print an SVG `<linearGradient>` |
| `--hex` | Print sampled hex values |
| `-n, --steps` | How many samples for `--hex` (default 10) |
| `--angle` | Angle for `--css` |
| `--id` | Element id for `--svg` |
| `-i, --info` | Describe a single color |
| `-l, --list` | Preview every preset |
| `--colors` | Preview every named color |

<a href="./examples/help.ts"><img src="https://raw.githubusercontent.com/tool3/grfti-cli/master/examples/svgs/help.svg" width="720" alt="help"></a>

Flags and the DSL do the same work, so use whichever reads better in the shell:

```sh
grfti "pink, cyan" -d vertical -r "hello"
grfti "gradient(pink, cyan):vertical:reverse" "hello"
```

<a href="./examples/flags.ts"><img src="https://raw.githubusercontent.com/tool3/grfti-cli/master/examples/svgs/flags.svg" width="720" alt="flags"></a>

<a href="./examples/banner.ts"><img src="https://raw.githubusercontent.com/tool3/grfti-cli/master/examples/svgs/banner.svg" width="380" alt="banner"></a> <a href="./examples/stdin.ts"><img src="https://raw.githubusercontent.com/tool3/grfti-cli/master/examples/svgs/stdin.svg" width="380" alt="stdin"></a>

A typo comes back with the nearest match and a non-zero exit code, on stderr:

<a href="./examples/errors.ts"><img src="https://raw.githubusercontent.com/tool3/grfti-cli/master/examples/svgs/errors.svg" width="720" alt="errors"></a>

## Colors

Anything grfti parses: a CSS color name, `#rgb` / `#rgba` / `#rrggbb` / `#rrggbbaa`, `rgb()`,
`rgba()`, `hsl()`, `hsv()`, `oklab()`, `oklch()`, or `ansi256(196)`. Quote specs that contain
spaces or parentheses.

```sh
grfti "#ff7a59, #7c2bff" "hello"
grfti "rgb(255 122 89), oklch(0.6 0.24 295)" "hello"
grfti --info "hsl(210 80% 60%)"
```

<a href="./examples/presets.ts"><img src="https://raw.githubusercontent.com/tool3/grfti-cli/master/examples/svgs/presets.svg" width="380" alt="presets"></a> <a href="./examples/colors.ts"><img src="https://raw.githubusercontent.com/tool3/grfti-cli/master/examples/svgs/colors.svg" width="380" alt="colors"></a>

`--info` prints a swatch plus the hex, rgb, hsl and oklch forms, the nearest 256- and
16-color palette entries, relative luminance, and WCAG contrast against white and black.

<a href="./examples/info.ts"><img src="https://raw.githubusercontent.com/tool3/grfti-cli/master/examples/svgs/info.svg" width="720" alt="info"></a>

## Using it in scripts

`--hex`, `--css` and `--svg` make the gradient available to whatever comes next:

```sh
grfti sunset --hex -n 5                    # five hex stops, one per line
grfti sunset --css                          # linear-gradient(90deg, ...)
grfti sunset --svg --id hero                # <linearGradient id="hero" ...>

for hex in $(grfti aurora --hex -n 4); do echo "$hex"; done
```

<a href="./examples/hex.ts"><img src="https://raw.githubusercontent.com/tool3/grfti-cli/master/examples/svgs/hex.svg" width="380" alt="hex"></a> <a href="./examples/css-svg.ts"><img src="https://raw.githubusercontent.com/tool3/grfti-cli/master/examples/svgs/css-svg.svg" width="380" alt="css-svg"></a>

## Examples

Every picture on this page is a script in [`examples/`](./examples), and every one of them
runs:

```sh
npm run examples                  # build, then render all 13
npm run example examples/hex.ts   # or just one
```

Both build first and then run through `tsx`, which is a devDependency — the examples shell
out to `dist/cli.js`, so there has to be a `dist`.

`█` is the widest thing a terminal can paint, so a file of them is the closest a text grid
gets to a swatch — `examples/sources/blocks.txt` is six rows of nothing else, which is all
the swatch at the top of this page is:

```sh
grfti sunset -f examples/sources/blocks.txt
grfti sunset -d diagonal -f examples/sources/blocks.txt
grfti "rainbow:vertical" -f examples/sources/blocks.txt
```

Each example defines `grfti` as a shell function pointing at `dist/cli.js` and runs it
through bash, so pipes, loops and command substitution all work and the command in the
script is the command in the picture. [examples/README.md](./examples/README.md) has the
full table.

## Color depth

Depth is detected from `FORCE_COLOR`, `NO_COLOR`, `GRFTI_DEPTH`, `COLORTERM`, `TERM`,
`TERM_PROGRAM`, `CI` and whether stdout is a TTY. As with every well-behaved CLI, redirecting
to a file or piping into another program drops the color:

```sh
grfti sunset "hello" > out.txt          # plain text
FORCE_COLOR=3 grfti sunset "hello" > out.txt   # keeps the escapes
grfti sunset "hello" -D truecolor       # same, per invocation
grfti sunset "hello" | less -R          # FORCE_COLOR=3 or -D truecolor
```

<a href="./examples/depth.ts"><img src="https://raw.githubusercontent.com/tool3/grfti-cli/master/examples/svgs/depth.svg" width="720" alt="depth"></a>

## Development

Sources are pure TypeScript: no `.js` anywhere outside `dist`, and no file extensions in
internal imports. The package is CommonJS with `module: NodeNext`, so `ts-node` runs the
sources as-is:

```sh
npm start -- sunset "hello world"      # ts-node src/cli.ts
npx ts-node src/cli.ts --list
echo "hi" | npx ts-node src/cli.ts aurora
```

```sh
npm run typecheck   # tsc -p tsconfig.test.json, covers src and test, emits nothing
npm test            # vitest
npm run build       # tsc, src -> dist
npm run dev         # tsc --watch
```

## License

MIT
