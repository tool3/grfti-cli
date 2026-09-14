import { bare, blank, heading, note, run, save } from './support'

save('depth', {
  title: 'color depth',
  palette: 'noir',
  lines: [
    heading('-D pins the depth, per invocation'),
    blank,
    ...run('grfti sunset -D truecolor -f sources/blocks.txt'),
    ...run('grfti sunset -D ansi256 -f sources/blocks.txt'),
    ...run('grfti sunset -D ansi16 -f sources/blocks.txt'),
    blank,
    heading('and, like any well-behaved CLI, a pipe drops the color entirely'),
    blank,
    ...bare('grfti sunset "hello world" | cat -v'),
    ...bare('grfti sunset "hello world" -D truecolor | cat -v | head -c 92; echo " ..."'),
    ...bare('FORCE_COLOR=3 grfti sunset "hello world" | cat -v | head -c 92; echo " ..."'),
    note('NO_COLOR, GRFTI_DEPTH, COLORTERM, TERM, TERM_PROGRAM and CI are all consulted'),
  ],
})
