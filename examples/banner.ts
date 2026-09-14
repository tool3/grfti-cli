import { blank, heading, note, run, save } from './support'

save('banner', {
  title: 'files and banners',
  palette: 'synthwave',
  lines: [
    heading('-f reads the text from a file — multi-line input needs no extra flag'),
    blank,
    ...run('grfti synthwave -f sources/banner.txt'),
    ...run('grfti atlas -d vertical -f sources/banner.txt'),
    ...run('grfti "cyberpunk:diagonal" -f sources/banner.txt'),
    note('each line is painted across the width of the widest one, so columns line up'),
  ],
})
