import { Component, OnInit } from '@angular/core';
import { DayDetail, LichService } from '../../services/lich.service';

@Component({
  selector: 'app-tra-cuu',
  standalone: false,
  templateUrl: './tra-cuu.html',
  styleUrls: ['./tra-cuu.scss'],
})
export class TraCuu implements OnInit {
  selectedDate = this.toISODate(new Date());
  viewMode: 'box' | 'text' = 'box';
  result?: DayDetail;

  constructor(private lichService: LichService) {}

  ngOnInit(): void {
    this.onView();
  }

  onView(): void {
    if (!this.selectedDate) {
      return;
    }

    this.result = this.lichService.getDayDetail(this.selectedDate);
  }

  switchMode(mode: 'box' | 'text'): void {
    this.viewMode = mode;
  }

  get saoTotTieuBieu(): string[] {
    return this.lichService.saoTotTieuBieu;
  }

  get saoXauTieuBieu(): string[] {
    return this.lichService.saoXauTieuBieu;
  }

  get NGAY_KY() {
    return this.lichService.NGAY_KY;
  }

  get TRUNG_TANG() {
    return this.lichService.TRUNG_TANG;
  }

  get TRUNG_PHUC() {
    return this.lichService.TRUNG_PHUC;
  }

  private toISODate(date: Date): string {
    const tzOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tzOffset).toISOString().slice(0, 10);
  }
}
