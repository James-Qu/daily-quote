import { Injectable, signal, computed } from '@angular/core';
import { QUOTES, Quote } from './quotes';

const STORAGE_KEYS = {
  currentQuoteId: 'currentQuoteId',
  lastQuoteDate: 'lastQuoteDate',
  usedQuoteIds: 'usedQuoteIds',
} as const;

const LOW_POOL_THRESHOLD = 15;

@Injectable({ providedIn: 'root' })
export class QuoteOfTheDayService {
  private readonly usedQuoteIds = signal<number[]>(this.loadIds());
  readonly currentQuote = signal<Quote>(this.loadOrSelectQuote());
  readonly lastQuoteDate = signal(this.loadString(STORAGE_KEYS.lastQuoteDate, ''));
  readonly lowPoolWarning = signal('');
  private midnightTimer: ReturnType<typeof setTimeout> | null = null;

  readonly remainingCount = computed(() => QUOTES.length - this.usedQuoteIds().length);

  constructor() {
    this.updateLowPoolWarning();
    this.scheduleMidnightRefresh();
  }

  private loadOrSelectQuote(): Quote {
    const today = this.getTodayLocal();
    const storedDate = this.loadString(STORAGE_KEYS.lastQuoteDate, '');
    const storedId = this.loadNumber(STORAGE_KEYS.currentQuoteId, 0);

    if (storedDate === today && storedId > 0) {
      const q = QUOTES.find(x => x.id === storedId);
      if (q) return q;
    }

    return this.selectNextQuote(today);
  }

  private selectNextQuote(today: string): Quote {
    const used = this.usedQuoteIds();
    const available = QUOTES.filter(q => !used.includes(q.id));

    let quote: Quote;
    if (available.length === 0) {
      this.usedQuoteIds.set([]);
      localStorage.setItem(STORAGE_KEYS.usedQuoteIds, '[]');
      const idx = Math.floor(Math.random() * QUOTES.length);
      quote = QUOTES[idx];
    } else {
      const idx = Math.floor(Math.random() * available.length);
      quote = available[idx];
    }

    this.usedQuoteIds.update(ids => [...ids, quote.id]);
    localStorage.setItem(STORAGE_KEYS.usedQuoteIds, JSON.stringify(this.usedQuoteIds()));
    localStorage.setItem(STORAGE_KEYS.currentQuoteId, String(quote.id));
    localStorage.setItem(STORAGE_KEYS.lastQuoteDate, today);
    this.lastQuoteDate.set(today);

    this.updateLowPoolWarning();
    return quote;
  }

  refreshIfNeeded(): void {
    const today = this.getTodayLocal();
    if (this.lastQuoteDate() !== today) {
      this.currentQuote.set(this.selectNextQuote(today));
    }
  }

  private scheduleMidnightRefresh(): void {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setDate(midnight.getDate() + 1);
    midnight.setHours(0, 0, 0, 0);
    const msUntilMidnight = midnight.getTime() - now.getTime();

    this.midnightTimer = setTimeout(() => {
      this.currentQuote.set(this.selectNextQuote(this.getTodayLocal()));
      this.scheduleMidnightRefresh();
    }, msUntilMidnight);
  }

  private updateLowPoolWarning(): void {
    const remaining = this.remainingCount();
    if (remaining === 0) {
      this.lowPoolWarning.set("You've completed the full collection! Starting over.");
    } else if (remaining <= LOW_POOL_THRESHOLD) {
      this.lowPoolWarning.set(`Only ${remaining} quotes left in your collection — new ones coming soon.`);
    } else {
      this.lowPoolWarning.set('');
    }
  }

  private getTodayLocal(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  private loadIds(): number[] {
    try {
      const v = localStorage.getItem(STORAGE_KEYS.usedQuoteIds);
      return v ? JSON.parse(v) : [];
    } catch {
      return [];
    }
  }

  private loadNumber(key: string, fallback: number): number {
    const v = localStorage.getItem(key);
    return v !== null ? Number(v) : fallback;
  }

  private loadString(key: string, fallback: string): string {
    return localStorage.getItem(key) ?? fallback;
  }
}
