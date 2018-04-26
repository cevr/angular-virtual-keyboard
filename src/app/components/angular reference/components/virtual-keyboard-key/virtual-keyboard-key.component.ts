import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  AfterViewInit,
} from '@angular/core';
import memo from 'memo-decorator';

import { KeyPressInterface } from '../../interfaces/key-press.interface';
import {
  KeyboardLayout,
  specialKeys,
  specialKeyIcons,
  specialKeyTexts,
  notDisabledSpecialKeys
} from '../../models/layouts';
import {
  isSpacer,
  isSpecial,
  shouldWarn,
  isNeverDisabled
} from '../../helpers/keys';

@Component({
  selector: 'virtual-keyboard-key',
  changeDetection: ChangeDetectionStrategy.OnPush,

  templateUrl: './virtual-keyboard-key.component.html',
  styleUrls: ['./virtual-keyboard-key.component.scss']
})
export class VirtualKeyboardKeyComponent implements OnInit {
  @Input() key: string;
  @Input() disabled: boolean;
  @Input() inputRef;
  @Output() keyPress = new EventEmitter<KeyPressInterface>();

  public special = false;
  public spacer = false;
  public flexValue: string;
  public keyValue: string;
  public icon: string;
  public text: string;
  public warn = false;
  public isNeverDisabled = false;
  /**
   * Constructor of the class.
   */
  public constructor(public changeDetection: ChangeDetectorRef) {
  }

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
      this.warn = shouldWarn(this.key);
      this.isNeverDisabled = notDisabledSpecialKeys.indexOf(this.key) !== -1

      const specialKey = /^(\w+)(:(\d+(\.\d+)?))?$/g.exec(this.key);
      this.keyValue = specialKey[1];

      if (specialKey[3]) {
        multiplier = parseFloat(specialKey[3]);
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


  ngDoCheck() {
    console.count('ngDoCheck')
  }
  ngOnChanges() {
    console.count('ngOnChanges')
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
