import { Component, OnInit } from '@angular/core';
import { DateDetailService, DayDetail } from '../../services/date-detail.service';

type DayCell = {
  date: Date;
  iso: string;
  day: number;
  inMonth: boolean;
  isToday: boolean;
  mood: string;
  lunarDay: number;
  lunarMonth: number;
  lunarLeap: boolean;
  canChiNgay: string;
  ngayHoangHacDao: any
};

@Component({
  selector: 'app-lich-am-thang',
  standalone: false,
  templateUrl: './lich-am-thang.html',
  styleUrl: './lich-am-thang.scss',
})
export class LichAmThang implements OnInit {
  selectedYear = new Date().getFullYear();
  selectedMonth = new Date().getMonth() + 1;
  selectedDateIso = '';
  weeks: DayCell[][] = [];
  detail?: DayDetail;

  readonly months = Array.from({ length: 12 }, (_, i) => i + 1);

  constructor(private dateDetailService: DateDetailService) {}

  ngOnInit(): void {
    this.buildCalendar();
    this.goToday();
  }

  goToday(): void {
    const today = new Date();
    this.selectedYear = today.getFullYear();
    this.selectedMonth = today.getMonth() + 1;
    this.buildCalendar();
    this.selectDate(today);
  }

  onMonthChange(): void {
    this.buildCalendar();
  }

  selectDate(date: Date | string): void {
    const iso = typeof date === 'string' ? date : this.toISO(date);
    this.selectedDateIso = iso;
    this.detail = this.dateDetailService.getDayDetail(iso);
    console.log(this.detail);
  }

  selectCell(cell: DayCell): void {
    this.selectedYear = cell.date.getFullYear();
    this.selectedMonth = cell.date.getMonth() + 1;
    this.selectDate(cell.iso);
    this.buildCalendar();
  }

  private buildCalendar(): void {
    const cells: DayCell[] = [];
    const firstOfMonth = new Date(this.selectedYear, this.selectedMonth - 1, 1);
    // Đặt tuần bắt đầu từ Thứ 2 (T2)
    const startDow = (firstOfMonth.getDay() + 6) % 7; // 0 (T2) -> 6 (CN)
    const daysInMonth = new Date(this.selectedYear, this.selectedMonth, 0).getDate();

    const prevMonthLast = new Date(this.selectedYear, this.selectedMonth - 1, 0);
    for (let i = startDow - 1; i >= 0; i--) {
      const d = new Date(this.selectedYear, this.selectedMonth - 2, prevMonthLast.getDate() - i);
      cells.push(this.toCell(d, false));
    }

    for (let d = 1; d <= daysInMonth; d++) {
      cells.push(this.toCell(new Date(this.selectedYear, this.selectedMonth - 1, d), true));
    }

    const nextFill = (7 - (cells.length % 7)) % 7;
    for (let i = 1; i <= nextFill; i++) {
      const d = new Date(this.selectedYear, this.selectedMonth, i);
      cells.push(this.toCell(d, false));
    }

    const weeks: DayCell[][] = [];
    for (let i = 0; i < cells.length; i += 7) {
      weeks.push(cells.slice(i, i + 7));
    }
    this.weeks = weeks;

    const selDate = this.selectedDateIso
      ? new Date(this.selectedDateIso)
      : new Date(this.selectedYear, this.selectedMonth - 1, 1);
    if (
      selDate.getMonth() + 1 !== this.selectedMonth ||
      selDate.getFullYear() !== this.selectedYear
    ) {
      this.selectDate(new Date(this.selectedYear, this.selectedMonth - 1, 1));
    }
  }

  private toCell(d: Date, inMonth: boolean): DayCell {
    const today = new Date();
    const detail = this.dateDetailService.getDayDetail(d);
    const [lunarDay, lunarMonth] = detail.lunarDate.split('/').map((x) => Number(x));
    return {
      date: d,
      iso: this.toISO(d),
      day: d.getDate(),
      inMonth,
      isToday: d.toDateString() === today.toDateString(),
      mood: this.getMood(detail),
      lunarDay: lunarDay || 0,
      lunarMonth: lunarMonth || 0,
      lunarLeap: detail.lunarLeap,
      canChiNgay: detail.canChiNgay,
      ngayHoangHacDao: detail.ngayHoangDao
    };
  }

  private toISO(date: Date): string {
    const tzOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tzOffset).toISOString().slice(0, 10);
  }

  private getMood(detail: DayDetail | undefined) {
    if (detail?.ngayHoangDao)
      return detail?.ngayHoangDao?.good == true ? 'good' : 'bad';
    else
      return "neutral";
  }
}
