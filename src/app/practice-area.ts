import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-practice-area',
  imports: [FormsModule],
  templateUrl: './practice-area.html',
})
export class PracticeArea {
  practiceText = '';
}
