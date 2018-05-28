import { Pipe, PipeTransform } from '@angular/core';
import { isSpecial, isLetter } from '../helpers/keys';
import { KeyboardLayout, shiftNumberLayout } from '../models/layouts';
import memo from 'memo-decorator';
@Pipe({
  name: 'getLayout',
  pure: true
})
export class VirtualKeyboardLayoutPipe implements PipeTransform {
  @memo()
  transform(layout: KeyboardLayout): KeyboardLayout {
    const newLayout = [...layout];
    newLayout.shift();
    newLayout.unshift(shiftNumberLayout.map(key => ({ value: key })));
    return newLayout.map(row =>
      row.map(
        keyObject =>
          isSpecial(keyObject.value) && !isLetter(keyObject.value)
            ? keyObject
            : {
                ...keyObject,
                value: keyObject.value.toUpperCase()
              }
      )
    );
  }
}
