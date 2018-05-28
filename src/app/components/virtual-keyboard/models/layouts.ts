export type KeyboardLayout = Array<Array<any>>;

export const extendedKeyboard: KeyboardLayout = [
  ['Delete:1', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Backspace:1'],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'Left', 'Right'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', '-', '_', '\u005C'],
  ['Shift:2', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
  ['Escape:2', 'SpaceBar:6', 'Enter:2']
];

export const numericKeyboard: KeyboardLayout = [
  ['Delete:2', 'Spacer:2', 'Backspace:2'],
  ['7:2', '8:2', '9:2'],
  ['4:2', '5:2', '6:2'],
  ['1:2', '2:2', '3:2'],
  ['Escape:2', '0:2', 'Enter:2']
];

export const shiftNumberLayout = [
  'Delete:1',
  '!',
  '@',
  '#',
  '$',
  '%',
  '?',
  '&',
  '*',
  '(',
  ')',
  'Backspace:1'
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
  Delete: 'delete_sweep',
  SpaceBar: 'space_bar',
  Escape: 'clear',
  Left: 'keyboard_arrow_left',
  Right: 'keyboard_arrow_right',
  Shift: 'keyboard_arrow_up'
};

export const specialKeyTexts = {
  CapsLock: 'Caps',
  Shift: 'Shift'
};

export const notDisabledSpecialKeys = [
  'Enter',
  'Backspace',
  'Escape',
  'Delete',
  'Left',
  'Right'
];
