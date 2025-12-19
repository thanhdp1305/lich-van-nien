import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class AmLich {
  INT(d: number): number {
    return Math.floor(d);
  }

  jdFromDate(dd: number, mm: number, yy: number): number {
    const a = this.INT((14 - mm) / 12);
    const y = yy + 4800 - a;
    const m = mm + 12 * a - 3;
    let jd =
      dd + this.INT((153 * m + 2) / 5) + 365 * y + this.INT(y / 4) - this.INT(y / 100) + this.INT(y / 400) - 32045;
    if (jd < 2299161) {
      jd = dd + this.INT((153 * m + 2) / 5) + 365 * y + this.INT(y / 4) - 32083;
    }
    return jd;
  }

  getNewMoonDay(k: number, timeZone: number): number {
    const T = k / 1236.85;
    const T2 = T * T;
    const T3 = T2 * T;
    const dr = Math.PI / 180;
    let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
    Jd1 += 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);

    const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
    const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
    const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;

    const C1 =
      (0.1734 - 0.000393 * T) * Math.sin(M * dr) +
      0.0021 * Math.sin(2 * M * dr) -
      0.4068 * Math.sin(Mpr * dr) +
      0.0161 * Math.sin(2 * Mpr * dr) -
      0.0004 * Math.sin(3 * Mpr * dr) +
      0.0104 * Math.sin(2 * F * dr) -
      0.0051 * Math.sin((M + Mpr) * dr) -
      0.0074 * Math.sin((M - Mpr) * dr) +
      0.0004 * Math.sin((2 * F + M) * dr) -
      0.0004 * Math.sin((2 * F - M) * dr) -
      0.0006 * Math.sin((2 * F + Mpr) * dr) +
      0.001 * Math.sin((2 * F - Mpr) * dr) +
      0.0005 * Math.sin((2 * Mpr + M) * dr);

    const deltat =
      T < -11 ? 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 : -0.000278 + 0.000265 * T + 0.000262 * T2;
    const JdNew = Jd1 + C1 - deltat;
    return this.INT(JdNew + 0.5 + timeZone / 24);
  }

  getSunLongitude(jdn: number, timeZone: number): number {
    const T = (jdn - 2451545.5 - timeZone / 24) / 36525;
    const T2 = T * T;
    const dr = Math.PI / 180;
    const M = 357.5291 + 35999.0503 * T - 0.0001559 * T2;
    const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
    const DL =
      (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M) +
      (0.019993 - 0.000101 * T) * Math.sin(2 * dr * M) +
      0.00029 * Math.sin(3 * dr * M);
    let L = (L0 + DL) * dr;
    L -= Math.PI * 2 * this.INT(L / (Math.PI * 2));
    return this.INT((L / Math.PI) * 6);
  }

  getLunarMonth11(yy: number, timeZone: number): number {
    const off = this.jdFromDate(31, 12, yy) - 2415021;
    const k = this.INT(off / 29.530588853);
    let nm = this.getNewMoonDay(k, timeZone);
    const sunLong = this.getSunLongitude(nm, timeZone);
    if (sunLong >= 9) nm = this.getNewMoonDay(k - 1, timeZone);
    return nm;
  }

  getLeapMonthOffset(a11: number, timeZone: number): number {
    let k = this.INT((a11 - 2415021.076998695) / 29.530588853 + 0.5);
    let last = 0;
    let i = 1;
    let arc = this.getSunLongitude(this.getNewMoonDay(k + i, timeZone), timeZone);
    do {
      last = arc;
      i++;
      arc = this.getSunLongitude(this.getNewMoonDay(k + i, timeZone), timeZone);
    } while (arc !== last && i < 14);
    return i - 1;
  }

  convertSolar2Lunar(dd: number, mm: number, yy: number, timeZone: number) {
    const dayNumber = this.jdFromDate(dd, mm, yy);
    const k = this.INT((dayNumber - 2415021.076998695) / 29.530588853);
    let monthStart = this.getNewMoonDay(k + 1, timeZone);
    if (monthStart > dayNumber) monthStart = this.getNewMoonDay(k, timeZone);

    let a11 = this.getLunarMonth11(yy, timeZone);
    const b11 = this.getLunarMonth11(yy + 1, timeZone);
    let lunarYear: number;
    let lunarMonth: number;
    let lunarDay: number;
    let lunarLeap = 0;

    if (a11 >= monthStart) {
      lunarYear = yy;
      a11 = this.getLunarMonth11(yy - 1, timeZone);
    } else {
      lunarYear = yy + 1;
    }

    lunarDay = dayNumber - monthStart + 1;
    const diff = this.INT((monthStart - a11) / 29);
    lunarMonth = diff + 11;

    if (b11 - a11 > 365) {
      const leapMonthDiff = this.getLeapMonthOffset(a11, timeZone);
      if (diff >= leapMonthDiff) {
        lunarMonth = diff + 10;
        if (diff === leapMonthDiff) lunarLeap = 1;
      }
    }

    if (lunarMonth > 12) lunarMonth -= 12;
    if (lunarMonth >= 11 && diff < 4) lunarYear--;

    return { lunarDay, lunarMonth, lunarYear, lunarLeap };
  }

  getJdnAndLunar(dateInput: string | Date) {
    const tz = 7;
    const d = typeof dateInput === "string" ? new Date(dateInput) : new Date(dateInput);
    const dd = d.getDate();
    const mm = d.getMonth() + 1;
    const yy = d.getFullYear();
    const jdn = this.jdFromDate(dd, mm, yy);
    const lunar = this.convertSolar2Lunar(dd, mm, yy, tz);

    return {
      jdn,
      lunar
    }
  }
  
  sunLongitude(jdn: number): number {
    const T = (jdn - 2451545.0) / 36525.0;
    const M = 357.5291 + 35999.0503 * T;
    const L0 = 280.46645 + 36000.76983 * T;
    const DL = (1.9146 - 0.004817 * T) * Math.sin((M * Math.PI) / 180) + 0.019993 * Math.sin((2 * M * Math.PI) / 180);
    const L = L0 + DL;
    return ((L % 360) + 360) % 360;
  }
}
