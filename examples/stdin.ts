import { blank, heading, note, run, save } from './support'

save('stdin', {
  title: 'pipes',
  palette: 'matrix',
  lines: [
    heading('no text argument? grfti reads stdin'),
    blank,
    ...run('echo "piped straight in" | grfti vaporwave'),
    ...run('cat sources/banner.txt | grfti matrix'),
    ...run('printf "one\\ntwo\\nthree\\n" | grfti "toxic:vertical"'),
    blank,
    heading('which makes it the last stage of any pipeline'),
    blank,
    ...run('ls sources | grfti "abyss:vertical"'),
    note('figlet grfti | grfti vaporwave works exactly the same way'),
  ],
})
