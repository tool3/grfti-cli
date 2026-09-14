import { blank, heading, note, run, save } from './support'

save('presets', {
  title: '--list',
  palette: 'vaporwave',
  lines: [
    heading('every preset, previewed where you can actually see it'),
    note('no preset name collides with a CSS color name, so the DSL is never ambiguous'),
    blank,
    ...run('grfti --list'),
  ],
})
