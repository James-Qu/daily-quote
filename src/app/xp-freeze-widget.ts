import { Component, inject } from '@angular/core';
import { StreakService } from './streak.service';

@Component({
  selector: 'app-xp-freeze-widget',
  templateUrl: './xp-freeze-widget.html',
})
export class XpFreezeWidget {
  readonly streakService = inject(StreakService);

  redeem(): void {
    this.streakService.redeemFreeze();
  }
}
