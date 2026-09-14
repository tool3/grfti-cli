import { blank, heading, note, run, save } from './support'

save('paint', {
  title: 'painting text',
  palette: 'sunset',
  lines: [
    heading('the first argument is the gradient, the rest is the text'),
    blank,
    ...run('grfti sunset "hello world"'),
    ...run('grfti "pink, cyan" "hello world"'),
    ...run('grfti "#ff7a59, #7c2bff" "hello world"'),
    ...run('grfti "gradient(green, yellow):reverse" "hello world"'),
    heading('one color is a gradient with one stop'),
    blank,
    ...run('grfti hotpink "just this color"'),
    note('quote anything with spaces or parentheses — it is still one shell argument'),
  ],
})
