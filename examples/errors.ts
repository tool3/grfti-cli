import { blank, heading, note, run, save } from './support'

save('errors', {
  title: 'when it goes wrong',
  palette: 'passion',
  lines: [
    heading('a typo comes back with the nearest match and a non-zero exit code'),
    blank,
    ...run('grfti stealblue "hello"; echo "exit $?"'),
    ...run('grfti "pink, cyan:vertcal" "hello"; echo "exit $?"'),
    ...run('grfti "pink, cyan" --css --hex "hello"; echo "exit $?"'),
    note('errors go to stderr, so a pipeline never swallows them'),
  ],
})
