import { blank, heading, note, run, save } from './support'

save('hex', {
  title: '--hex',
  palette: 'aurora',
  lines: [
    heading('--hex samples the ramp and prints the stops, one per line'),
    blank,
    ...run('grfti sunset --hex -n 5'),
    blank,
    heading('which is what makes it scriptable'),
    blank,
    ...run('for hex in $(grfti aurora --hex -n 6); do grfti "$hex" "  $hex  "; done'),
    note('-n defaults to 10; the gradient can be a preset, a list or a full spec'),
  ],
})
