export type KeyboardLayout = Array<Array<string>>;

export const extendedKeyboard: KeyboardLayout = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Backspace:2'],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'Left', 'Right'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'Spacer',],
  ['Shift:2','z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', ],
  ['Delete:2', '@', 'SpaceBar:6', 'Spacer', 'Escape:2']
];

export const numericKeyboard: KeyboardLayout = [
  ['Left:2', 'Spacer:2', 'Right:2'],
  ['1:2', '2:2', '3:2', ],
  ['4:2', '5:2', '6:2', ],
  ['7:2', '8:2', '9:2', ],
  ['Delete:2', '0:2', 'Backspace:2']
];


export const specialKeys: Array<string> = [
  'Enter',
  'Backspace',
  'Escape',
  'CapsLock',
  'SpaceBar',
  'Spacer',
  'Shift',
  'Delete',
  'Left',
  'Right'
];

export const specialKeyIcons = {
  Enter: 'keyboard_return',
  Backspace: 'backspace',
  Escape: 'close',
  SpaceBar: 'space_bar',
  Delete: 'delete',
  Left: 'keyboard_arrow_left',
  Right: 'keyboard_arrow_right'
};

export const specialKeyTexts = {
  CapsLock: 'Caps',
  Shift: 'Shift'
};

export const notDisabledSpecialKeys = [
  'Enter',
  'Backspace',
  'Escape',
  'Delete'
];