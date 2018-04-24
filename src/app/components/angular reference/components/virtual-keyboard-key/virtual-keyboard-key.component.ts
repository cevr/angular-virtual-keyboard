import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  ChangeDetectionStrategy
} from '@angular/core';

import { KeyPressInterface } from '../../interfaces/key-press.interface';
import {
  isSpacer,
  isSpecial,
  shouldWarn,
  notDisabledSpecialKeys,
  specialKeyIcons,
  specialKeyTexts
} from '../../models/layouts';

@Component({
  selector: 'virtual-keyboard-key',
  changeDetection: ChangeDetectionStrategy.OnPush,

  templateUrl: './virtual-keyboard-key.component.html',
  styleUrls: ['./virtual-keyboard-key.component.css']
})
export class VirtualKeyboardKeyComponent implements OnInit {
  @Input() key: string;
  @Input() disabled: boolean;
  @Input() inputIsEmpty: boolean;
  @Output() keyPress = new EventEmitter<KeyPressInterface>();

  public special = false;
  public spacer = false;
  public flexValue: string;
  public keyValue: string;
  public icon: string;
  public text: string;
  public warn = false;
  /**
   * Constructor of the class.
   */
  public constructor() {}

  /**
   * On init life cycle hook, within this we'll initialize following properties:
   *  - special
   *  - keyValue
   *  - flexValue
   */
  public ngOnInit(): void {
    let multiplier = 1;
    let fix = 0;

    if (this.key.length > 1) {
      this.spacer = isSpacer(this.key);
      this.special = isSpecial(this.key);
      this.warn = shouldWarn(this.key)

      const matches = /^(\w+)(:(\d+(\.\d+)?))?$/g.exec(this.key);

      this.keyValue = matches[1];

      if (matches[3]) {
        multiplier = parseFloat(matches[3]);
        fix = (multiplier - 1) * 4;
      }
    } else {
      this.keyValue = this.key;
    }

    if (this.special) {
      if (specialKeyIcons.hasOwnProperty(this.keyValue)) {
        this.icon = specialKeyIcons[this.keyValue];
      } else if (specialKeyTexts.hasOwnProperty(this.keyValue)) {
        this.text = specialKeyTexts[this.keyValue];
      }
    }

    this.flexValue = `${multiplier * 64 + fix}px`;
  }



  /**
   * Method to check if key is disabled or not.
   *
   * @returns {boolean}
   */
  public isDisabled(): boolean {
    if (this.spacer ) {
      return true;
    } else if (
      this.disabled &&
      notDisabledSpecialKeys.indexOf(this.keyValue) !== -1
    ) {
      return false;
    } else if (this.key.includes('Delete') && this.inputIsEmpty) {

      return true;
    }else {
      return this.disabled;
    }
  }

  /**
   * Method to handle actual "key" press from virtual keyboard.
   *  1) Key is "Special", process special key event
   *  2) Key is "Normal", append this key value to input
   */
  public onKeyPress(): void {
    this.keyPress.emit({
      special: this.special,
      keyValue: this.keyValue,
      key: this.key
    });
  }
}
