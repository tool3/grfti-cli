import { blank, heading, note, run, save } from './support'

save('colors', {
  title: '--colors',
  palette: 'pastel',
  lines: [
    heading('every named color grfti answers to'),
    note('the CSS set, plus marine and transparent'),
    blank,
    ...run('grfti --colors'),
  ],
})
