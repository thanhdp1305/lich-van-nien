import { Injectable } from "@angular/core";
import { DateDetailService, DayDetail } from "./date-detail.service";
import { CHU_KY_LAP_CUA_SAO_HOANG_HAC_DAO, DS_CHI, DS_SAO_HAC_DAO, DS_SAO_HOANG_DAO, MAP_CHI_THANG_TO_START_DAY_CHI } from "../data";

export type DayCell = {
  date: Date;
  iso: string;
  day: number;
  inMonth: boolean;
  isToday: boolean;
  mood?: string;
  lunarDay?: number;
  lunarMonth?: number;
  lunarLeap?: boolean;
  canChiNgay?: string;
  saoHoanhHacDao?: string;
  ngayHoangHacDao?: any;
  detail?: DayDetail;
  [key: string]: any;
};

@Injectable({ providedIn: "root" })
export class CalendarService {
  selectedYear: any = null;
  selectedMonth: any = null;
  selectedDateIso = "";
  weeks: DayCell[][] = [];

  constructor(private dateDetailService: DateDetailService) {}

  goToday(): void {
    const today = new Date();
    this.selectedYear = today.getFullYear();
    this.selectedMonth = today.getMonth() + 1;
    this.buildCalendar();
  }

  getDateInfo(date: Date): DayCell | undefined {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    // console.log("có gọi")

    if (year == this.selectedYear && month == this.selectedMonth) {
      return this.findDateInMonth(date);
    } else {
      console.log("có gọi")
      this.buildCalendarWithDate(date);
      return this.findDateInMonth(date);
    }
  }

  buildCalendarWithDate(date: Date) {
    this.selectedYear = date.getFullYear();
    this.selectedMonth = date.getMonth() + 1;
    this.buildCalendar();
    // this.buildHoangHacDaoThang(date);
    this.buildChiTietTotXauThang();
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
  }

  private toCell(d: Date, inMonth: boolean): DayCell {
    const today = new Date();
    const {jdn,lunar} = this.dateDetailService.getJdnAndLunar(d);
    return {
      date: d,
      iso: this.toISO(d),
      day: d.getDate(),
      inMonth,
      isToday: d.toDateString() === today.toDateString(),
      lunarDay: lunar.lunarDay || 0,
      lunarMonth: lunar.lunarMonth || 0,
      lunarLeap: lunar.lunarLeap === 1,
      canChiNgay: this.dateDetailService.getCanChiNgay(jdn)
    };
  }

  private toISO(date: Date): string {
    const tzOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tzOffset).toISOString().slice(0, 10);
  }

  private getMood(thongTinHoangHacDao: any) {
    if (thongTinHoangHacDao) return thongTinHoangHacDao?.good == true ? "good" : "bad";
    else return "neutral";
  }

  private buildHoangHacDaoThang(date: Date) {
    const { canNgay, chiNgay, canThang, chiThang, canNam, chiNam } = this.dateDetailService.getCanChiNgayAm(date);

    const ngayBatDauChuKy = MAP_CHI_THANG_TO_START_DAY_CHI[chiThang];

    console.log({ canNgay, chiNgay, canThang, chiThang, canNam, chiNam }, ngayBatDauChuKy);

    const weekFlat: any = [...this.weeks].reduce((acc, val) => [...acc, ...val], []);
    console.log(weekFlat)

    const ngayBatDauIdx = weekFlat.findIndex((date: any) => {
      const canChi = this.dateDetailService.getCanChiNgayAm(date.date);
      if (chiNgay === canChi.chiNgay) {
        return true;
      }
      return false;
    });

    console.log('ngayBatDauIdx', ngayBatDauIdx)

    let chuKyLap = 0;
    for (let i = ngayBatDauIdx; i < weekFlat.length; i++) {
      weekFlat[i].saoHoanhHacDao = CHU_KY_LAP_CUA_SAO_HOANG_HAC_DAO[chuKyLap];
      if (chuKyLap == 11) {
        chuKyLap = 0;
      } else {
        chuKyLap = chuKyLap + 1;
      }
    }

    chuKyLap = 11;
    for (let i = ngayBatDauIdx - 1; i >= 0; i--) {
      weekFlat[i].saoHoanhHacDao = CHU_KY_LAP_CUA_SAO_HOANG_HAC_DAO[chuKyLap];
      if (chuKyLap == 0) {
        chuKyLap = 11;
      } else {
        chuKyLap = chuKyLap - 1;
      }
    }

    for (let date of weekFlat) {
      if (DS_SAO_HOANG_DAO.includes(date.saoHoanhHacDao)) {
        date.ngayHoangHacDao = {
          type: 'Hoàng đạo',
          good: true,
          sao: date.saoHoanhHacDao
        }
      } else if (DS_SAO_HAC_DAO.includes(date.saoHoanhHacDao)) {
        date.ngayHoangHacDao = date.ngayHoangDao = {
          type: 'Hắc đạo',
          good: false,
          sao: date.saoHoanhHacDao
        }
      }
    }

    this.weeks = [...this.toWeeksMatrix(weekFlat)];
  }

  private buildChiTietTotXauThang() {
    let weekFlat: any = [...this.weeks].reduce((acc, val) => [...acc, ...val], []);
    weekFlat = weekFlat.map((date: any) => {
      const detail = this.buildChiTietTotXauNgay(date);

      return {
        ...date,
        detail: detail.detail,
        mood: detail.mood
      }
    });
    this.weeks = [...this.toWeeksMatrix(weekFlat)];
  }

  private buildChiTietTotXauNgay(dayCell: DayCell) {
    const detail = this.dateDetailService.getDayDetail(dayCell.date);

    return {
      detail,
      mood: this.getMood(dayCell.ngayHoangHacDao)
    }
  }

  private toWeeksMatrix(weeksFlat: any) {
    const result = [];
    for (let i = 0; i < weeksFlat.length; i += 7) {
      result.push(weeksFlat.slice(i, i + 7));
    }
    return result;
  }
  
  private findDateInMonth(date: Date) {
    const weekFlat: DayCell[] = [...this.weeks].reduce((acc, val) => [...acc, ...val], []);
    return weekFlat.find((d: DayCell) => {
      return d.date.toDateString() === date.toDateString();
    })
  }
}
