import { blank, heading, note, run, save } from './support'

save('swatches', {
  title: 'block swatches',
  palette: 'sunset',
  lines: [
    heading('a file of block characters is the closest a terminal gets to a swatch'),
    note('sources/blocks.txt is six rows of █ — the gradient does the rest'),
    blank,
    ...run('grfti sunset -f sources/blocks.txt'),
    ...run('grfti sunset -d vertical -f sources/blocks.txt'),
    ...run('grfti sunset -d diagonal -f sources/blocks.txt'),
    ...run('grfti "rainbow:vertical" -f sources/blocks.txt'),
  ],
})
