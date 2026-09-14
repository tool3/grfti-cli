import { blank, heading, note, run, save } from './support'

save('css-svg', {
  title: '--css and --svg',
  palette: 'gemini',
  lines: [
    heading('the same ramp, printed for whatever renders it next'),
    blank,
    ...run('grfti sunset --css'),
    ...run('grfti sunset --css --angle 45'),
    ...run('grfti "sunset:vertical" --css'),
    blank,
    ...run('grfti sunset --svg --id hero'),
    blank,
    heading('so a build script can write the stylesheet it is about to ship'),
    blank,
    ...run('echo ".hero { background: $(grfti sunset --css --angle 135); }"'),
    note('--css, --svg and --hex are mutually exclusive; everything else composes'),
  ],
})
