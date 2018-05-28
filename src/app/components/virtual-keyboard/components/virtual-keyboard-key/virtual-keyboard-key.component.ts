import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { isEqual } from 'lodash';

import { KeyPressInterface } from '../../interfaces/key-press.interface';
import {
  specialKeyIcons,
  specialKeyTexts,
  notDisabledSpecialKeys
} from '../../models/layouts';
import { isSpacer, isSpecial, shouldWarn, isEnterKey } from '../../helpers/keys';

@Component({
  selector: 'virtual-keyboard-key',
  changeDetection: ChangeDetectionStrategy.OnPush,

  templateUrl: './virtual-keyboard-key.component.html',
  styleUrls: ['./virtual-keyboard-key.component.scss']
})
export class VirtualKeyboardKeyComponent implements OnInit {
  @Input() key: any;
  @Input() disabled: boolean;
  @Input() inputRef;
  @Output() keyPress = new EventEmitter<KeyPressInterface>();

  public special = false;
  public spacer = false;
  public warn = false;
  public isEnter = false;
  public isNeverDisabled = false;

  public flexValue: string;
  public keyValue: string;
  public icon: string;
  public text: string;

  private changes;
  /**
   * Constructor of the class.
   */
  public constructor(public changeDetection: ChangeDetectorRef) {}

  /**
   * On init life cycle hook, within this we'll initialize following properties:
   *  - special
   *  - keyValue
   *  - flexValue
   */
  ngOnInit(): void {
    let multiplier = 1;
    let fix = 0;

    if (this.key.value.length > 1) {
      this.spacer = isSpacer(this.key.value);
      this.special = isSpecial(this.key.value);
      this.warn = shouldWarn(this.key.value);
      this.isEnter = isEnterKey(this.key.value);

      this.isNeverDisabled = notDisabledSpecialKeys.indexOf(this.key.value) !== -1;

      const specialKey = /^(\w+)(:(\d+(\.\d+)?))?$/g.exec(this.key.value);
      this.keyValue = specialKey[1];

      if (specialKey[3]) {
        multiplier = parseFloat(specialKey[3]);
        fix = (multiplier - 1) * 4;
      }
    } else {
      this.keyValue = this.key.value;
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

  ngOnChanges(changes) {
    if (this.changes) {
      if (!isEqual(this.changes, changes)) {
        if (!isEqual(changes.disabled, this.changes.disabled)) {
          this.changeDetection.detectChanges();
        }
        if (!isEqual(changes.key, this.changes.key)) {
          this.changeDetection.detectChanges();
        }
      }
    }
    this.changes = changes;
  }

  ngAfterViewInit() {
    this.changeDetection.detach();
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
      key: this.key.value
    });
  }
}
