import { Component, input } from '@angular/core';
import { Quote } from './quotes';

@Component({
  selector: 'app-quote-card',
  templateUrl: './quote-card.html',
})
export class QuoteCard {
  readonly quote = input.required<Quote>();
}
