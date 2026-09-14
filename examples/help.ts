import { blank, heading, note, run, save } from './support'

save('help', {
  title: '--help',
  palette: 'vercel',
  lines: [
    heading('the whole surface, in one screen'),
    blank,
    ...run('grfti --help'),
    note('every flag has a DSL equivalent, so nothing here is the only way to say it'),
  ],
})
