import { Component, inject, signal } from '@angular/core';
import { StreakService } from './streak.service';

@Component({
  selector: 'app-streak-button',
  templateUrl: './streak-button.html',
  styles: [`
    .confetti-container {
      position: absolute;
      inset: 0;
      pointer-events: none;
      overflow: hidden;
    }
    .confetti-piece {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 10px;
      height: 10px;
      background: var(--color);
      border-radius: 2px;
      animation: confetti-burst 1s ease-out forwards;
      animation-delay: var(--delay);
      --x: 0;
      --y: 0;
    }
    @keyframes confetti-burst {
      0% {
        transform: translate(-50%, -50%) translate(0, 0) rotate(0deg) scale(1);
        opacity: 1;
      }
      100% {
        transform: translate(-50%, -50%) translate(var(--x), var(--y)) rotate(720deg) scale(0);
        opacity: 0;
      }
    }
  `],
})
export class StreakButton {
  readonly streakService = inject(StreakService);
  showConfetti = false;
  confettiPieces: Array<{ x: string; y: string; color: string; delay: string }> = [];

  private readonly colors = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6b9d', '#c44dff'];

  extend(): void {
    this.streakService.extendStreak();
    this.triggerConfetti();
  }

  private triggerConfetti(): void {
    this.confettiPieces = Array.from({ length: 40 }, (_, i) => ({
      x: `${(Math.random() - 0.5) * 300}px`,
      y: `${(Math.random() - 0.5) * 300}px`,
      color: this.colors[Math.floor(Math.random() * this.colors.length)],
      delay: `${Math.random() * 0.3}s`,
    }));
    this.showConfetti = true;
    setTimeout(() => {
      this.showConfetti = false;
    }, 1500);
  }
}
