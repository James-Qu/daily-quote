import { Component, inject, signal, OnInit } from '@angular/core';
import { QuoteCard } from './quote-card';
import { PracticeArea } from './practice-area';
import { StreakButton } from './streak-button';
import { XpFreezeWidget } from './xp-freeze-widget';
import { LowQuotePoolBanner } from './low-quote-pool-banner';
import { QuoteOfTheDayService } from './quote-of-the-day.service';
import { StreakService } from './streak.service';

@Component({
  selector: 'app-root',
  imports: [
    QuoteCard,
    PracticeArea,
    StreakButton,
    XpFreezeWidget,
    LowQuotePoolBanner,
  ],
  templateUrl: './app.html',
})
export class App implements OnInit {
  readonly quoteService = inject(QuoteOfTheDayService);
  readonly streakService = inject(StreakService);
  readonly isDark = signal(false);
  readonly bgColor = signal('#f8f9fa');

  ngOnInit(): void {
    this.quoteService.refreshIfNeeded();
    this.streakService.evaluateDaily();
  }

  toggleTheme(): void {
    this.isDark.update(v => !v);
    this.bgColor.set(this.isDark() ? '#1a1d23' : '#f8f9fa');
  }
}
