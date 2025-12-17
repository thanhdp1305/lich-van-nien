import { Component, Input } from '@angular/core';
import { BottomNavItem } from '../../models';

@Component({
  selector: 'app-bottom-nav',
  standalone: false,
  templateUrl: './bottom-nav.html',
  styleUrl: './bottom-nav.scss',
})
export class BottomNav {
  @Input() tabs: BottomNavItem[] = [];

  visibleTabs: BottomNavItem[] = [];
  overflowTabs: BottomNavItem[] = [];

  readonly MAX_VISIBLE = 4;

  ngOnInit(): void {
    if (this.tabs.length <= this.MAX_VISIBLE) {
      this.visibleTabs = this.tabs;
    } else {
      this.visibleTabs = this.tabs.slice(0, this.MAX_VISIBLE - 1);
      this.overflowTabs = this.tabs.slice(this.MAX_VISIBLE - 1);
    }
  }
}
