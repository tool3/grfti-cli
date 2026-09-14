import { blank, heading, note, run, save } from './support'

save('flags', {
  title: 'flags and the dsl',
  palette: 'stripe',
  lines: [
    heading('flags and the string DSL do the same work — use whichever reads better'),
    blank,
    ...run('grfti "pink, cyan" -r "reversed with a flag"'),
    ...run('grfti "gradient(pink, cyan):reverse" "reversed in the spec"'),
    blank,
    heading('-d runs the gradient down the lines instead of across them'),
    blank,
    ...run('grfti sunset -d vertical -f sources/release.txt'),
    blank,
    heading('-s picks the interpolation space, -b paints the background'),
    blank,
    ...run('grfti "blue, yellow" -s rgb "rgb, the way most tools do it"'),
    ...run('grfti "blue, yellow" -s oklab "oklab, the way grfti does it"'),
    ...run('grfti sunset -b "  painted behind the text  "'),
    note('every flag has a DSL equivalent, so a config file and a shell call agree'),
  ],
})
