import { Component, OnInit } from '@angular/core';
import { DateDetailService, DayDetail } from '../../services/date-detail.service';
import { CalendarService, DayCell } from '../../services/calendar.service';

@Component({
  selector: 'app-tra-cuu',
  standalone: false,
  templateUrl: './tra-cuu.html',
  styleUrls: ['./tra-cuu.scss'],
})
export class TraCuu implements OnInit {
  selectedDate = this.toISODate(new Date());
  viewMode: 'box' | 'text' = 'box';
  result?: DayDetail | any;

  constructor(
    private dateDetailService: DateDetailService,
    private calenderService: CalendarService
  ) {}

  ngOnInit(): void {
    this.onView();
  }

  onView(): void {
    if (!this.selectedDate) {
      return;
    }

    this.result = this.dateDetailService.getDayDetail(this.selectedDate);
  }

  switchMode(mode: 'box' | 'text'): void {
    this.viewMode = mode;
  }

  get saoTotTieuBieu(): string[] {
    return this.dateDetailService.saoTotTieuBieu;
  }

  get saoXauTieuBieu(): string[] {
    return this.dateDetailService.saoXauTieuBieu;
  }

  get NGAY_KY() {
    return this.dateDetailService.NGAY_KY;
  }

  get TRUNG_TANG() {
    return this.dateDetailService.TRUNG_TANG;
  }

  get TRUNG_PHUC() {
    return this.dateDetailService.TRUNG_PHUC;
  }

  private toISODate(date: Date): string {
    const tzOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tzOffset).toISOString().slice(0, 10);
  }
}
