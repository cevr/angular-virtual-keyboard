import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ElementRef
} from '@angular/core';

@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.css']
})
export class KeyboardComponent implements OnInit {
  constructor(element: ElementRef) {
    this.inputNode = element.nativeElement;
  }
  inputNode;

  @Input() isNumeric = false;
  isUppercased() {}
  ngOnInit() {}
}

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
