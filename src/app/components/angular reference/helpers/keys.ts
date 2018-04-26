import { KeyboardLayout, specialKeys, notDisabledSpecialKeys } from '../models/layouts';
import memo from 'memo-decorator';
/**
 * function to check if key should warn user or not
 * @returns {boolean}
 */
export function shouldWarn(key) {
  if (key.includes('Delete') || key.includes('Escape')) {
    return true;
  }

  return false;
}
/**
 * Helper function to determine if given key is 'Spacer' or not.
 *
 * @param {string}  key
 * @returns {boolean}
 */
export function isSpacer(key: string): boolean {
  if (key.length > 1) {
    return /^Spacer(:(\d+(\.\d+)?))?$/g.test(key);
  }

  return false;
}

export function isNeverDisabled(key) {



  return notDisabledSpecialKeys.indexOf(key) !== -1

}
/**
 * Helper function to determine if given key is special or not.
 *
 * @param {string}  key
 * @returns {boolean}
 */
export function isSpecial(key: string): boolean {
  if (key.length > 1) {
    return !!specialKeys.filter(specialKey => {
      const pattern = new RegExp(`^(${specialKey})(:(\\d+(\\.\\d+)?))?$`, 'g');

      return pattern.test(key);
    }).length;
  }

  return false;
}
/**
 * Function to change specified layout to CapsLock layout.
 *
 * @param {KeyboardLayout}  layout
 * @param {boolean}         caps
 * @returns {KeyboardLayout}
 */
export function keyboardCapsLockLayout(
  layout: KeyboardLayout,
  caps: boolean
): KeyboardLayout {


  if(caps){
    return layout.map(row => row.map(key => isSpecial(key) ? key : key.toUpperCase() ))
  } else {
    return layout.map(row => row.map(key => isSpecial(key) ? key : key.toLowerCase()))
  }

}

