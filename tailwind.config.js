/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      colors : {
        'rustic-green' : '#8A9A5B',
        'rustic-pink' : '#CFA690',
        'rustic-brown' : '#705C4C',
        'rustic-gray' : '#D4CECE',
        'rustic-gold' : '#5C6244'
      }
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}

