import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { AppComponent } from './app.component';
import { KeyboardComponent } from './components/keyboard/keyboard.component';
import { KeyboardButtonComponent } from './components/keyboard/components/keyboard-button/keyboard-button.component';
import { VirtualKeyboardModule } from './components/angular reference';

@NgModule({
  declarations: [AppComponent, KeyboardComponent, KeyboardButtonComponent],
  imports: [
    BrowserModule,
    NoopAnimationsModule,
    MatIconModule,
    MatButtonModule,
    VirtualKeyboardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
