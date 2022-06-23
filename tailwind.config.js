const libConfig = require('./lib/tailwind.config');
const path = require('path');

module.exports = {
  darkMode: 'class',
  content: [
    ...libConfig.content.map(p => `./` + path.join('./lib', p)),
    ...libConfig.content
  ],
  theme: {
    ...libConfig.theme
  },
  plugins: [
    ...libConfig.plugins
  ],
}