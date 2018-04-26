import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  environment = false;
  placeholder = 'test';
  layout = 'extended';
  @ViewChild('test') test;

  onSubmit(payload) {
    console.log(payload);
  }
}
