import { Injectable, signal, computed, effect } from '@angular/core';

const STORAGE_KEYS = {
  currentStreak: 'currentStreak',
  lastCompletedDate: 'lastCompletedDate',
  xp: 'xp',
  streakFreezes: 'streakFreezes',
} as const;

@Injectable({ providedIn: 'root' })
export class StreakService {
  readonly currentStreak = signal(this.loadNumber(STORAGE_KEYS.currentStreak, 0));
  readonly lastCompletedDate = signal(this.loadString(STORAGE_KEYS.lastCompletedDate, ''));
  readonly xp = signal(this.loadNumber(STORAGE_KEYS.xp, 0));
  readonly streakFreezes = signal(this.loadNumber(STORAGE_KEYS.streakFreezes, 0));

  readonly canRedeemFreeze = computed(() => this.xp() >= 10 && this.streakFreezes() < 2);
  readonly isStreakExtendable = signal(false);

  constructor() {
    effect(() => {
      localStorage.setItem(STORAGE_KEYS.currentStreak, String(this.currentStreak()));
    });
    effect(() => {
      localStorage.setItem(STORAGE_KEYS.lastCompletedDate, this.lastCompletedDate());
    });
    effect(() => {
      localStorage.setItem(STORAGE_KEYS.xp, String(this.xp()));
    });
    effect(() => {
      localStorage.setItem(STORAGE_KEYS.streakFreezes, String(this.streakFreezes()));
    });
  }

  evaluateDaily(): void {
    const today = this.getTodayLocal();
    const last = this.lastCompletedDate();

    if (last === today) {
      this.isStreakExtendable.set(false);
      return;
    }

    this.isStreakExtendable.set(true);

    if (!last) return;

    const lastDate = new Date(last + 'T00:00:00');
    const yesterday = new Date(today + 'T00:00:00');
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    if (last === yesterdayStr) return;

    if (this.streakFreezes() > 0) {
      this.streakFreezes.update(v => v - 1);
    } else {
      this.currentStreak.set(0);
    }
  }

  extendStreak(): void {
    if (!this.isStreakExtendable()) return;

    const today = this.getTodayLocal();
    this.currentStreak.update(v => v + 1);
    this.xp.update(v => Math.min(v + 1, 30));
    this.lastCompletedDate.set(today);
    this.isStreakExtendable.set(false);
  }

  redeemFreeze(): void {
    if (!this.canRedeemFreeze()) return;
    this.xp.update(v => v - 10);
    this.streakFreezes.update(v => v + 1);
  }

  private getTodayLocal(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  private loadNumber(key: string, fallback: number): number {
    const v = localStorage.getItem(key);
    return v !== null ? Number(v) : fallback;
  }

  private loadString(key: string, fallback: string): string {
    return localStorage.getItem(key) ?? fallback;
  }
}
