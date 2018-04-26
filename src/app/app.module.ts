import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { AppComponent } from './app.component';
import { KeyboardComponent } from './components/keyboard/keyboard.component';
import { KeyboardButtonComponent } from './components/keyboard/components/keyboard-button/keyboard-button.component';
import { VirtualKeyboardModule } from './components/angular reference/virtual-keyboard.module';

@NgModule({
  declarations: [AppComponent, KeyboardComponent, KeyboardButtonComponent],
  imports: [
    BrowserModule,
    NoopAnimationsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    VirtualKeyboardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
