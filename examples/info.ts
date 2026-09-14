import { blank, heading, note, run, save } from './support'

save('info', {
  title: '--info',
  palette: 'falcon',
  lines: [
    heading('--info describes a single color, in every form it has'),
    blank,
    ...run('grfti --info "#3d7fb3"'),
    blank,
    heading('it takes anything grfti parses'),
    blank,
    ...run('grfti --info "hsl(210 80% 60%)"'),
    note('the swatch is a row of block characters painted in the color itself'),
  ],
})
