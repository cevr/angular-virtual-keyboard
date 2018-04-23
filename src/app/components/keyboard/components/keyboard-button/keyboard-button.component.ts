import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';

@Component({
  selector: 'app-keyboard-button',
  templateUrl: './keyboard-button.component.html',
  styleUrls: ['./keyboard-button.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false
})
export class KeyboardButtonComponent implements OnInit {
  constructor() {}

  @Input() keyboardButtonValue: string;
  @Input() keyboardButtonClassList: string;
  @Input() keyboardButtonIcon: string;

  @Input() isFocused = false;
  @Input() isDisabled = false;
  @Input() hasIcon = false;
  @Output() clickHandler = new EventEmitter();

  ngOnInit() {}
}
