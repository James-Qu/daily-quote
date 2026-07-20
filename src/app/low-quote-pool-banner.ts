import { Component, inject } from '@angular/core';
import { QuoteOfTheDayService } from './quote-of-the-day.service';

@Component({
  selector: 'app-low-quote-pool-banner',
  templateUrl: './low-quote-pool-banner.html',
})
export class LowQuotePoolBanner {
  readonly service = inject(QuoteOfTheDayService);
}
