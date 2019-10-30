var mlKeyboard = mlKeyboard || {layouts: {}};

mlKeyboard.layouts.it_IT = [
  {d: '\\', u: '|'},
  {d: '1',u: '!'},
  {d: '2',u: '"'},
  {d: '3',u: '£'},
  {d: '4',u: '$'},
  {d: '5',u: '%'},
  {d: '6',u: '&'},
  {d: '7',u: '/'},
  {d: '8',u: '('},
  {d: '9',u: ')'},
  {d: '0',u: '='},
  {d: '\'',u: '?'},
  {d: 'ì',u: '^'},
  {}, // Delete
  {}, // Tab
  {d: 'q',u: 'Q'},
  {d: 'w',u: 'W'},
  {d: 'e',u: 'E'},
  {d: 'r',u: 'R'},
  {d: 't',u: 'T'},
  {d: 'y',u: 'Y'},
  {d: 'u',u: 'U'},
  {d: 'i',u: 'I'},
  {d: 'o',u: 'O'},
  {d: 'p',u: 'P'},
  {d: 'e',u: 'é', m: [
    {d: 'e', u: 'é'},
    {d: '[', u: '{'}
  ]},
  {d: '+',u: '*', m: [
    {d: '+', u:'*'},
    {d: ']', u: '}'}
  ]},
  {d: 'ù',u: '§'},
  {}, // Caps lock
  {d: 'a',u: 'A'},
  {d: 's',u: 'S'},
  {d: 'd',u: 'D'},
  {d: 'f',u: 'F'},
  {d: 'g',u: 'G'},
  {d: 'h',u: 'H'},
  {d: 'j',u: 'J'},
  {d: 'k',u: 'K'},
  {d: 'l',u: 'L'},
  {d: 'ò',u: 'ç', m:[
    {d: 'ò',u: 'ç'},
    {d:'@', u: 'Ç'}
  ]},
  {d: 'à',u: '°', m:[
    {d: 'à',u: '°'},
    {d:'#', u: '∞'}
  ]},
  {}, // Return
  {}, // Left shift
  {d: '<', u:'>'},
  {d: 'z',u: 'Z'},
  {d: 'x',u: 'X'},
  {d: 'c',u: 'C'},
  {d: 'v',u: 'V'},
  {d: 'b',u: 'B'},
  {d: 'n',u: 'N'},
  {d: 'm',u: 'M'},
  {d: ',',u: ';'},
  {d: '.',u: ':'},
  {d: '-',u: '_'},
  {}, // Right shift
  {}  // Space
];
