import { Injectable } from '@angular/core';

export type NgocHapItem = { k: string; type: 'good' | 'bad'; v: string };
export type GioXuatHanhItem = { chi: string; range: string; note: string };
export type NhiThapBatTuItem = {
  key: string;
  data: { sao: string; loai: string; moTa: string; nen: string; ky: string; ngoaiLe?: string };
};
export type TrucItem = { key: string; data: { tot: string; xau: string } };
export type XungHopValue = { lucHop?: string; tamHop?: string[]; xung?: string; hinh?: string; hai?: string; pha?: string; tuyet?: string };
export type DayDetail = {
  solarDate: string;
  lunarDate: string;
  lunarLeap: boolean;
  canChiNgay: string;
  canChiThang: string;
  canChiNam: string;
  napAm: string;
  nguHanhDanhGia: string;
  nguHanhCan: string;
  nguHanhChi: string;
  xungHop: XungHopValue;
  lucDieuName: string;
  lucDieuDesc: string;
  gioHoangDao: string[];
  nhiThapBatTu: NhiThapBatTuItem;
  truc: TrucItem;
  banhTo: { canStr: string; chiStr: string; lunarStr: string };
  ngocHapList: NgocHapItem[];
  huongList: { k: string; v: string }[];
  gioXuatHanhNotes: GioXuatHanhItem[];
  textSummary: string;
};

@Injectable({ providedIn: 'root' })
export class LichService {
  /** API chính: lấy thông tin chi tiết cho 1 ngày (ISO string hoặc Date) */
  getDayDetail(dateInput: string | Date): DayDetail {
    const tz = 7;
    const d = typeof dateInput === 'string' ? new Date(dateInput) : new Date(dateInput);
    const dd = d.getDate();
    const mm = d.getMonth() + 1;
    const yy = d.getFullYear();
    const jdn = this.jdFromDate(dd, mm, yy);
    const lunar = this.convertSolar2Lunar(dd, mm, yy, tz);
    const canChiNgay = this.getCanChiNgay(jdn);
    const [canNgay, chiNgay] = canChiNgay.split(' ');
    const canChiNam = this.getCanChiNam(lunar.lunarYear);
    const canNamIndex = (lunar.lunarYear + 6) % 10;
    const canChiThang = this.getCanChiThang(canNamIndex, lunar.lunarMonth);
    const napAm = this.getNapAmSafe(canNgay, chiNgay);
    const nguHanhDG = this.danhGiaNguHanh(canNgay, chiNgay);
    const xh = this.getXungHopValue(chiNgay);
    const lucDieuName = this.LUC_DIEU_THEO_CHI[chiNgay];
    const lucDieuDesc = this.LUC_DIEU[lucDieuName] || '';
    const gioHD_chis = this.GIO_HOANG_DAO[chiNgay] || [];
    const gioHD_text = gioHD_chis.map((c) => `${c} (${this.KHUNG_GIO[c] || ''})`);
    const nhi = this.getNhiThapBatTu(jdn);
    const truc = this.getTrucByJdn(jdn);
    const banhTo = this.buildBanhTo(canNgay, chiNgay, lunar.lunarDay);
    const ngocHapList = this.buildNgocHap(canNgay, chiNgay, lunar.lunarDay);
    const huongList = Object.entries(this.HUONG_XUAT_HANH).map(([k, v]) => ({ k, v }));
    const gioXuatHanhNotes = this.buildGioXuatHanhNotes();

    const textSummary = [
      `Dương lịch: ${dd}/${mm}/${yy}`,
      `Âm lịch: ${lunar.lunarDay}/${lunar.lunarMonth}${lunar.lunarLeap ? ' (Nhuận)' : ''}/${lunar.lunarYear}`,
      `Can-Chi ngày: ${canChiNgay}`,
      `Can-Chi tháng: ${canChiThang}`,
      `Can-Chi năm: ${canChiNam}`,
      `Nạp âm: ${napAm || '—'}`,
      `Ngũ hành đánh giá: ${nguHanhDG}`,
      `Lục Diệu: ${lucDieuName} — ${lucDieuDesc}`,
      `Giờ Hoàng Đạo: ${gioHD_text.join(', ') || '—'}`,
      `Nhị thập bát tú: ${nhi.key} — ${nhi.data.sao || ''} (${nhi.data.loai})`,
      `Trực: ${truc.key} — Nên: ${truc.data.tot} — Kiêng: ${truc.data.xau}`,
      `Bành Tổ (CAN ngày): ${canNgay} — ${banhTo.canStr || '—'}`,
      `Ngọc Hạp (tạm): ${ngocHapList.length ? ngocHapList.map((x) => x.k).join(', ') : '—'}`,
      `Hướng xuất hành (tham khảo): ${huongList.map((h) => `${h.k}: ${h.v}`).join('; ')}`,
    ].join('\n\n');

    return {
      solarDate: `${dd}/${mm}/${yy}`,
      lunarDate: `${lunar.lunarDay}/${lunar.lunarMonth}`,
      lunarLeap: lunar.lunarLeap === 1,
      canChiNgay,
      canChiThang,
      canChiNam,
      napAm: napAm || '—',
      nguHanhDanhGia: nguHanhDG,
      nguHanhCan: `${canNgay} — ${this.NGU_HANH_CAN[canNgay]}`,
      nguHanhChi: `${chiNgay} — ${this.NGU_HANH_CHI[chiNgay]}`,
      xungHop: xh,
      lucDieuName,
      lucDieuDesc,
      gioHoangDao: gioHD_text,
      nhiThapBatTu: nhi,
      truc,
      banhTo,
      ngocHapList,
      huongList,
      gioXuatHanhNotes,
      textSummary,
    };
  }

  get saoTotTieuBieu(): string[] {
    return Object.keys(this.NGOC_HAP_SAO_TOT_FULL).slice(0, 6);
  }

  get saoXauTieuBieu(): string[] {
    return Object.keys(this.NGOC_HAP_SAO_XAU_FULL).slice(0, 6);
  }

  // ----------------- Helpers -----------------
  private buildBanhTo(canNgay: string, chiNgay: string, lunarDay: number): { canStr: string; chiStr: string; lunarStr: string } {
    return {
      canStr: this.BACH_KY_CAN[canNgay] || 'Không có thông tin cụ thể.',
      chiStr: this.BACH_KY_CHI[chiNgay] || 'Không có thông tin cụ thể.',
      lunarStr: this.BACH_KY_LUNAR[lunarDay] || 'Không có thông tin cụ thể.',
    };
  }

  private buildNgocHap(canNgay: string, chiNgay: string, lunarDay: number): NgocHapItem[] {
    let list: NgocHapItem[] = [];
    (this.SAO_TOT_CAN[canNgay] || []).forEach((k) => {
      if (this.NGOC_HAP_SAO_TOT_FULL[k]) list.push({ k, type: 'good', v: this.NGOC_HAP_SAO_TOT_FULL[k] });
    });
    (this.SAO_XAU_CAN[canNgay] || []).forEach((k) => {
      if (this.NGOC_HAP_SAO_XAU_FULL[k]) list.push({ k, type: 'bad', v: this.NGOC_HAP_SAO_XAU_FULL[k] });
    });
    (this.SAO_XAU_CHI[chiNgay] || []).forEach((k) => {
      if (this.NGOC_HAP_SAO_XAU_FULL[k]) list.push({ k, type: 'bad', v: this.NGOC_HAP_SAO_XAU_FULL[k] });
    });
    const TN = [3, 7, 13, 18, 22, 27];
    if (TN.includes(lunarDay)) {
      list.push({ k: 'Tam Nương', type: 'bad', v: this.NGOC_HAP_SAO_XAU_FULL['Tam Nương'] });
    }
    const seen: Record<string, boolean> = {};
    list = list.filter((item) => {
      if (seen[item.k]) return false;
      seen[item.k] = true;
      return true;
    });
    return list;
  }

  private buildGioXuatHanhNotes(): GioXuatHanhItem[] {
    return Object.entries(this.GIO_XUAT_HANH_LY_THUAN_PHONG).map(([chi, note]) => ({
      chi,
      range: this.KHUNG_GIO[chi] || '',
      note,
    }));
  }

  private INT(d: number): number {
    return Math.floor(d);
  }

  private jdFromDate(dd: number, mm: number, yy: number): number {
    const a = this.INT((14 - mm) / 12);
    const y = yy + 4800 - a;
    const m = mm + 12 * a - 3;
    let jd = dd + this.INT((153 * m + 2) / 5) + 365 * y + this.INT(y / 4) - this.INT(y / 100) + this.INT(y / 400) - 32045;
    if (jd < 2299161) {
      jd = dd + this.INT((153 * m + 2) / 5) + 365 * y + this.INT(y / 4) - 32083;
    }
    return jd;
  }

  private getNewMoonDay(k: number, timeZone: number): number {
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

    const deltat = T < -11 ? 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 : -0.000278 + 0.000265 * T + 0.000262 * T2;
    const JdNew = Jd1 + C1 - deltat;
    return this.INT(JdNew + 0.5 + timeZone / 24);
  }

  private getSunLongitude(jdn: number, timeZone: number): number {
    const T = (jdn - 2451545.5 - timeZone / 24) / 36525;
    const T2 = T * T;
    const dr = Math.PI / 180;
    const M = 357.5291 + 35999.0503 * T - 0.0001559 * T2;
    const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
    const DL = (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M) + (0.019993 - 0.000101 * T) * Math.sin(2 * dr * M) + 0.00029 * Math.sin(3 * dr * M);
    let L = (L0 + DL) * dr;
    L -= Math.PI * 2 * this.INT(L / (Math.PI * 2));
    return this.INT((L / Math.PI) * 6);
  }

  private getLunarMonth11(yy: number, timeZone: number): number {
    const off = this.jdFromDate(31, 12, yy) - 2415021;
    const k = this.INT(off / 29.530588853);
    let nm = this.getNewMoonDay(k, timeZone);
    const sunLong = this.getSunLongitude(nm, timeZone);
    if (sunLong >= 9) nm = this.getNewMoonDay(k - 1, timeZone);
    return nm;
  }

  private getLeapMonthOffset(a11: number, timeZone: number): number {
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

  private convertSolar2Lunar(dd: number, mm: number, yy: number, timeZone: number) {
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

  private getCanChiNgay(jdn: number): string {
    const can = this.CAN[(jdn + 9) % 10];
    const chi = this.CHI[(jdn + 1) % 12];
    return `${can} ${chi}`;
  }

  private getCanChiThang(canNamIndex: number, thangAm: number): string {
    const canIndex = (canNamIndex * 12 + thangAm + 3) % 10;
    const chiIndex = (thangAm + 1) % 12;
    return `${this.CAN[canIndex]} ${this.CHI[chiIndex]}`;
  }

  private getCanChiNam(nam: number): string {
    const can = this.CAN[(nam + 6) % 10];
    const chi = this.CHI[(nam + 8) % 12];
    return `${can} ${chi}`;
  }

  private getNapAmSafe(can: string, chi: string): string {
    return this.NAP_AM[`${can} ${chi}`] || '';
  }

  private getXungHopValue(chi: string): XungHopValue {
    return {
      lucHop: this.LUC_HOP[chi],
      tamHop: this.TAM_HOP[chi],
      xung: this.XUNG[chi],
      hinh: this.HAI[chi],
      hai: this.HAI[chi],
      pha: this.PHA[chi],
      tuyet: this.TUYET[chi],
    };
  }

  private danhGiaNguHanh(can: string, chi: string): string {
    const hanhCan = this.NGU_HANH_CAN[can];
    const hanhChi = this.NGU_HANH_CHI[chi];
    if (this.NGU_HANH_SINH[hanhCan] === hanhChi) return 'Can sinh Chi - ngày rất tốt (cát).';
    if (this.NGU_HANH_SINH[hanhChi] === hanhCan) return 'Chi sinh Can - ngày tốt.';
    if (this.NGU_HANH_KHAC[hanhCan] === hanhChi) return 'Can khắc Chi - ngày xấu.';
    if (this.NGU_HANH_KHAC[hanhChi] === hanhCan) return 'Chi khắc Can - ngày hung.';
    return 'Can - Chi tương hòa - ngày bình ổn.';
  }

  private sunLongitude(jdn: number): number {
    const T = (jdn - 2451545.0) / 36525.0;
    const M = 357.5291 + 35999.0503 * T;
    const L0 = 280.46645 + 36000.76983 * T;
    const DL = (1.9146 - 0.004817 * T) * Math.sin((M * Math.PI) / 180) + 0.019993 * Math.sin((2 * M * Math.PI) / 180);
    const L = L0 + DL;
    return ((L % 360) + 360) % 360;
  }

  private getNhiThapBatTu(jdn: number): NhiThapBatTuItem {
    const lon = this.sunLongitude(jdn);
    const adj = (lon - this.OFFSET_28_TU + 360) % 360;
    const idx = Math.floor(adj / 13.3333333);
    const key = this.NHI_THAP_BAT_TU_LIST[idx];
    return { key, data: this.NHI_THAP_BAT_TU[key] };
  }

  private getTrucByJdn(jdn: number): TrucItem {
    const idx = ((jdn + this.TRUC_OFFSET) % 12 + 12) % 12;
    const key = this.TRUC_ORDER[idx];
    return { key, data: this.TRUC[key] };
  }

  // ----------------- Dữ liệu -----------------
  readonly GIO_HOANG_DAO: Record<string, string[]> = {
    Tý: ['Tý', 'Sửu', 'Mão', 'Ngọ', 'Thân', 'Dậu'],
    Sửu: ['Tý', 'Dần', 'Mão', 'Tỵ', 'Mùi', 'Tuất'],
    Dần: ['Sửu', 'Thìn', 'Tỵ', 'Thân', 'Dậu', 'Hợi'],
    Mão: ['Tý', 'Dần', 'Thìn', 'Ngọ', 'Mùi', 'Dậu'],
    Thìn: ['Sửu', 'Mão', 'Ngọ', 'Mùi', 'Tuất', 'Hợi'],
    Tỵ: ['Tý', 'Sửu', 'Thìn', 'Mùi', 'Tuất', 'Hợi'],
    Ngọ: ['Sửu', 'Thìn', 'Tỵ', 'Thân', 'Dậu', 'Hợi'],
    Mùi: ['Tý', 'Mão', 'Thìn', 'Ngọ', 'Dậu', 'Tuất'],
    Thân: ['Dần', 'Mão', 'Tỵ', 'Thân', 'Tuất', 'Hợi'],
    Dậu: ['Tý', 'Sửu', 'Thìn', 'Tỵ', 'Mùi', 'Tuất'],
    Tuất: ['Dần', 'Mão', 'Ngọ', 'Thân', 'Dậu', 'Hợi'],
    Hợi: ['Sửu', 'Thìn', 'Ngọ', 'Mùi', 'Tuất', 'Hợi'],
  };

  readonly KHUNG_GIO: Record<string, string> = {
    Tý: '23:00 - 00:59',
    Sửu: '01:00 - 02:59',
    Dần: '03:00 - 04:59',
    Mão: '05:00 - 06:59',
    Thìn: '07:00 - 08:59',
    Tỵ: '09:00 - 10:59',
    Ngọ: '11:00 - 12:59',
    Mùi: '13:00 - 14:59',
    Thân: '15:00 - 16:59',
    Dậu: '17:00 - 18:59',
    Tuất: '19:00 - 20:59',
    Hợi: '21:00 - 22:59',
  };

  readonly LUC_DIEU: Record<string, string> = {
    'Đại An': 'Tốt. Mọi việc đều hanh thông, đi lại thuận lợi, cầu tài lộc tốt.',
    'Lưu Niên': 'Xấu. Dễ gặp rủi ro, hao tài, thị phi.',
    'Tốc Hỷ': 'Rất tốt. Có tin vui, cưới hỏi, khai trương đều đẹp.',
    'Xích Khẩu': 'Xấu về kiện tụng, thị phi, tranh cãi.',
    'Tiểu Cát': 'Rất đẹp. Mọi sự may mắn, tài lộc.',
    'Không Vong': 'Hung. Việc khó thành, gặp trở ngại, tiền tài dễ mất.',
  };

  readonly LUC_DIEU_THEO_CHI: Record<string, string> = {
    Tý: 'Đại An',
    Sửu: 'Lưu Niên',
    Dần: 'Tốc Hỷ',
    Mão: 'Xích Khẩu',
    Thìn: 'Tiểu Cát',
    Tỵ: 'Không Vong',
    Ngọ: 'Đại An',
    Mùi: 'Lưu Niên',
    Thân: 'Tốc Hỷ',
    Dậu: 'Xích Khẩu',
    Tuất: 'Tiểu Cát',
    Hợi: 'Không Vong',
  };

  readonly NGAY_KY = {
    trungTang: 'Kỵ chôn cất, cưới xin, xuất hành, xây nhà, xây mồ mả.',
    trungPhuc: 'Kỵ chôn cất, cưới xin, xuất hành, xây nhà, xây mồ mả.',
    thapAcDaiBat: '10 ngày cực xấu, tuyệt kỵ việc lớn.',
  };

  readonly TRUNG_TANG = ['Nhâm Thân', 'Giáp Thân', 'Canh Thân', 'Mậu Thân'];
  readonly TRUNG_PHUC = ['Quý Dậu', 'Ất Dậu', 'Tân Dậu', 'Kỷ Dậu'];

  readonly LUC_HOP: Record<string, string> = { Tý: 'Sửu', Sửu: 'Tý', Dần: 'Hợi', Mão: 'Tuất', Thìn: 'Dậu', Tỵ: 'Thân', Ngọ: 'Mùi', Mùi: 'Ngọ', Thân: 'Tỵ', Dậu: 'Thìn', Tuất: 'Mão', Hợi: 'Dần' };
  readonly TAM_HOP: Record<string, string[]> = { Tý: ['Thìn', 'Thân'], Sửu: ['Tỵ', 'Dậu'], Dần: ['Ngọ', 'Tuất'], Mão: ['Mùi', 'Hợi'], Thìn: ['Tý', 'Thân'], Tỵ: ['Sửu', 'Dậu'], Ngọ: ['Dần', 'Tuất'], Mùi: ['Mão', 'Hợi'], Thân: ['Tý', 'Thìn'], Dậu: ['Sửu', 'Tỵ'], Tuất: ['Dần', 'Ngọ'], Hợi: ['Mão', 'Mùi'] };
  readonly XUNG: Record<string, string> = { Tý: 'Ngọ', Sửu: 'Mùi', Dần: 'Thân', Mão: 'Dậu', Thìn: 'Tuất', Tỵ: 'Hợi', Ngọ: 'Tý', Mùi: 'Sửu', Thân: 'Dần', Dậu: 'Mão', Tuất: 'Thìn', Hợi: 'Tỵ' };
  readonly HAI: Record<string, string> = { Tý: 'Mùi', Sửu: 'Ngọ', Dần: 'Tỵ', Mão: 'Thìn', Thìn: 'Mão', Tỵ: 'Dần', Ngọ: 'Sửu', Mùi: 'Tý', Thân: 'Hợi', Dậu: 'Tuật', Tuất: 'Dậu', Hợi: 'Thân' };
  readonly PHA: Record<string, string> = { Tý: 'Dậu', Sửu: 'Tuất', Dần: 'Hợi', Mão: 'Ngọ', Thìn: 'Sửu', Tỵ: 'Thân', Ngọ: 'Mão', Mùi: 'Thìn', Thân: 'Tỵ', Dậu: 'Tý', Tuất: 'Sửu', Hợi: 'Dần' };
  readonly TUYET: Record<string, string> = { Tý: 'Tỵ', Sửu: 'Ngọ', Dần: 'Mùi', Mão: 'Thân', Thìn: 'Dậu', Tỵ: 'Tuất', Ngọ: 'Hợi', Mùi: 'Tý', Thân: 'Sửu', Dậu: 'Dần', Tuất: 'Mão', Hợi: 'Thìn' };

  readonly BANH_TO: Record<string, string> = {
    Giáp: '“Giáp nhật bất khả thủ hành, xuất hành đa phong ba” - Không nên xuất hành tránh sóng gió.',
    Ất: '“Ất nhật bất khả tạo mộc, chủ phạm cô loan” - Tránh làm mộc kẻo cô độc.',
    Bính: '“Bính nhật bất khả hỏa táo, chủ táo bại” - Tránh nổi lửa lớn.',
    Đinh: '“Đinh nhật bất khả phụng sự, chủ đa thất tín” - Tránh cầu xin, dễ thất tín.',
    Mậu: '“Mậu nhật bất khả thủy công, chủ thất tài” - Kỵ làm việc sông nước.',
    Kỷ: '“Kỷ nhật bất khả khai thương, chủ thất lợi” - Kỵ mở kho, mở hàng.',
    Canh: '“Canh nhật bất khả giá thê, chủ tổn thất” - Kỵ cưới hỏi.',
    Tân: '“Tân nhật bất khả tầm y, chủ khẩu thiệt” - Kỵ xin việc dễ cãi vã.',
    Nhâm: '“Nhâm nhật bất ương thủy, nan canh đê phòng” - Kỵ tháo nước, hư đê điều.',
    Quý: '“Quý nhật bất vấn bốc, tự nhạ tai ương” - Kỵ gieo quẻ hỏi việc, dễ tai ương.',
    Tý: '“Tý nhật bất vấn bốc tự nhạ tai ương” - Kỵ gieo quẻ.',
    Sửu: '“Sửu nhật bất năng tác xa, chủ phá tài” - Tránh sửa xe, chế tạo.',
    Dần: '“Dần nhật bất khả táng môn, chủ bất an” - Kỵ mở cửa mộ.',
    Mão: '“Mão nhật bất khả kiến hỉ, chủ phá bại” - Kỵ mừng cưới.',
    Thìn: '“Thìn nhật bách sự bất thành” - Ngày hung, việc khó thành.',
    Tỵ: '“Tỵ nhật bất khả tác đạo, chủ tặc khởi” - Không nên đào đường.',
    Ngọ: '“Ngọ nhật bất khả tạo phòng, chủ đại hung” - Kỵ xây phòng ốc.',
    Mùi: '“Mùi nhật bất khả tạo ốc, chủ đại bại” - Kỵ xây nhà.',
    Thân: '“Thân nhật bất khả hôn nhân, chủ phân ly” - Kỵ cưới hỏi.',
    Dậu: '“Dậu nhật bất khả an tàm, chủ bất thành” - Kỵ nuôi tằm.',
    Tuất: '“Tuất nhật bất khả tế tự, chủ bất lợi” - Kỵ cúng tế.',
    Hợi: '“Hợi nhật bất khả khai trùng, chủ thất bại” - Kỵ khai kho, đào huyệt.',
  };

  readonly BACH_KY_CAN: Record<string, string> = {
    Giáp: 'Giáp nhật bất xuất hành, lộ đồ đa hiểm - Ngày Giáp kỵ xuất hành dễ gặp nguy hiểm.',
    Ất: 'Ất nhật bất tế tự, tổn tử tôn - Ngày Ất kỵ cúng bái, dễ tổn hại con cháu.',
    Bính: 'Bính nhật bất động thổ, chủ nhân khẩu thiệt - Ngày Bính kỵ động thổ vì dễ sinh tranh cãi.',
    Đinh: 'Đinh nhật bất mai táng, chủ táng sự trùng - Ngày Đinh kỵ an táng, dễ táng sự kéo dài.',
    Mậu: 'Mậu nhật bất khởi tạo, chủ tổn thê nhi - Ngày Mậu kỵ xây dựng, dễ hại vợ con.',
    Kỷ: 'Kỷ nhật bất an môn hộ, đa tụng tụng thị - Ngày Kỷ kỵ sửa cửa, dễ sinh kiện tụng.',
    Canh: 'Canh nhật bất khai kho, tổn tài bại khí - Ngày Canh kỵ mở kho, dễ hao tài.',
    Tân: 'Tân nhật bất kế thừa, chủ nhân đa bạo bệnh - Ngày Tân kỵ nhận chức/vị, dễ sinh bệnh.',
    Nhâm: 'Nhâm nhật bất ương thủy, nan canh đê phòng - Ngày Nhâm kỵ tháo nước, dễ hư hại đê điều.',
    Quý: 'Quý nhật bất phân tài, chủ tương tụng - Ngày Quý kỵ chia tài sản, dễ sinh kiện cáo.',
  };

  readonly BACH_KY_CHI: Record<string, string> = {
    Tý: 'Tý nhật bất vấn bốc, tự nhạ tai ương - Ngày Tý kỵ gieo quẻ, dễ rước họa.',
    Sửu: 'Sửu nhật bất tế tự, chủ tổn nhân khẩu - Ngày Sửu kỵ cúng tế, dễ hại người trong nhà.',
    Dần: 'Dần nhật bất nhiếp thú, chủ nhân đa tật bệnh - Ngày Dần kỵ thuần dưỡng vật nuôi, dễ sinh bệnh.',
    Mão: 'Mão nhật bất an trạch, chủ thất hỏa sự - Ngày Mão kỵ sửa nhà, dễ sinh hỏa hoạn.',
    Thìn: 'Thìn nhật bất khởi tạo, chủ thoái nhân khẩu - Ngày Thìn kỵ làm nhà, dễ giảm nhân đinh.',
    Tỵ: 'Tỵ nhật bất giá thú, chủ tương xâm hại - Ngày Tỵ kỵ cưới hỏi, dễ gặp xung hại.',
    Ngọ: 'Ngọ nhật bất cầm cân, chủ phá bại tài vật - Ngày Ngọ kỵ giao dịch tài chính, dễ hao tài.',
    Mùi: 'Mùi nhật bất dụng hỏa, chủ nhân khẩu thiệt - Ngày Mùi kỵ dùng lửa, dễ xảy ra cãi vã.',
    Thân: 'Thân nhật bất tàng bảo, chủ nhân khẩu bảo ngụy - Ngày Thân kỵ cất giữ tài vật, dễ bị vu hại.',
    Dậu: 'Dậu nhật bất mai táng, chủ táng sự bại - Ngày Dậu kỵ chôn cất, dễ táng sự không thành.',
    Tuất: 'Tuất nhật bất nạp tài, chủ nhân đa tranh đấu - Ngày Tuất kỵ nhận tài vật, dễ sinh cãi vã.',
    Hợi: 'Hợi nhật bất thụ ấn, chủ nhân đa thoái bại - Ngày Hợi kỵ nhận chức, dễ xuống chức/bất lợi.',
  };

  readonly BACH_KY_LUNAR: Record<number, string> = {
    1: 'Sơ nhất bất nhận tài vật - Kỵ nhận tiền của, dễ gặp điều không may.',
    2: 'Sơ nhị bất giá thú - Kỵ cưới hỏi, hôn nhân không thuận.',
    3: 'Sơ tam bất an táng - Kỵ an táng, dễ sinh chuyện rắc rối.',
    4: 'Sơ tứ bất xướng tụng - Kỵ kiện tụng, dễ thua thiệt.',
    5: 'Sơ ngũ bất tập chúng - Kỵ tụ tập đông người, dễ sinh tranh chấp.',
    6: 'Sơ lục bất an trạch - Kỵ sửa nhà, chuyển nhà, dễ gặp hung hiểm.',
    7: 'Sơ thất bất khốc tang - Kỵ khóc tang, dễ tổn khí.',
    8: 'Sơ bát bất hành phòng - Kỵ chuyện phòng the, dễ bất lợi sức khỏe.',
    9: 'Sơ cửu bất yến ẩm - Kỵ tiệc tùng, dễ sinh khẩu thiệt.',
    10: 'Sơ thập bất khai thị - Kỵ mở cửa hàng, kinh doanh dễ thất bại.',
    11: 'Thập nhất bất dụng y - Kỵ dùng thuốc, dễ bệnh thêm.',
    12: 'Thập nhị bất tế tự - Kỵ cúng tế, không linh nghiệm.',
    13: 'Thập tam bất khởi tạo - Kỵ xây dựng, dễ gặp trắc trở.',
    14: 'Thập tứ bất tằng phiên - Kỵ bắt đầu việc mới, dễ thay đổi bất lợi.',
    15: 'Thập ngũ bất khai kho - Kỵ mở kho xuất hàng, dễ hao hụt.',
    16: 'Thập lục bất nghiệm bốc - Kỵ gieo quẻ bói toán, dễ sai lệch.',
    17: 'Thập thất bất năng ngự - Kỵ lên xe ngựa/đi xa, dễ gặp khó khăn.',
    18: 'Thập bát bất mưu viễn hành - Kỵ tính chuyện đi xa, không thành.',
    19: 'Thập cửu bất an môn hộ - Kỵ sửa cửa, dễ gây tổn hại.',
    20: 'Nhị thập bất tích ốc - Kỵ cất nóc, hoàn thiện nhà.',
    21: 'Nhị thập nhất bất quy lộc - Kỵ nhận chức, nhận lộc, dễ mất uy tín.',
    22: 'Nhị thập nhị bất ẩm tửu - Kỵ uống rượu, dễ sinh họa.',
    23: 'Nhị thập tam bất động thổ - Kỵ động thổ, dễ xảy ra tai họa.',
    24: 'Nhị thập tứ bất yết kiến - Kỵ gặp gỡ quan quyền, dễ sinh phiền phức.',
    25: 'Nhị thập ngũ bất khốc tang - Kỵ khóc tang, hao tổn tinh thần.',
    26: 'Nhị thập lục bất nạp tài - Kỵ nhận tiền của, dễ mất mát.',
    27: 'Nhị thập thất bất yến ẩm - Kỵ ăn uống linh đình, dễ xung đột.',
    28: 'Nhị thập bát bất hoàn nhân - Kỵ hoàn trả đồ vật hay tiền bạc.',
    29: 'Nhị thập cửu bất tụ hội - Kỵ tụ họp, dễ xảy ra bất hòa.',
    30: 'Tam thập bất quy khách - Kỵ đón khách, dễ gặp điều phiền toái.',
  };

  readonly NHI_THAP_BAT_TU: Record<string, { sao: string; loai: string; moTa: string; nen: string; ky: string; ngoaiLe?: string }> = {
    Giác: { sao: 'Giác Mộc Giao', loai: 'Tốt', moTa: 'Tướng tinh con rồng, chủ trị ngày thứ 1.', nen: 'Tốt cho mọi việc.', ky: 'Kỵ chôn cất.', ngoaiLe: 'Tại Dần, Ngọ, Tuất mọi việc tốt.' },
    Cang: { sao: 'Cang Kim Long', loai: 'Xấu', moTa: 'Tướng tinh con rồng vàng.', nen: 'Không có việc gì thuận lợi.', ky: 'Kỵ mọi việc lớn.', ngoaiLe: 'Không có ngoại lệ.' },
    Đê: { sao: 'Đê Thổ Tử', loai: 'Xấu', moTa: 'Tướng tinh con dê.', nen: 'Tốt cho xây dựng.', ky: 'Kỵ chôn cất.', ngoaiLe: '' },
    Phòng: { sao: 'Phòng Nhật Thố', loai: 'Tốt', moTa: 'Tướng tinh con thỏ.', nen: 'Tốt cho cưới hỏi.', ky: 'Kỵ an táng.', ngoaiLe: '' },
    Tâm: { sao: 'Tâm Nguyệt Hồ', loai: 'Xấu', moTa: 'Tướng tinh con cáo.', nen: 'Không nên làm việc lớn.', ky: 'Kỵ chôn cất và cưới hỏi.', ngoaiLe: '' },
    Vĩ: { sao: 'Vĩ Hỏa Hổ', loai: 'Tốt', moTa: 'Tướng tinh con hổ.', nen: 'Tốt về mọi mặt.', ky: 'Kỵ chôn cất.', ngoaiLe: '' },
    Cơ: { sao: 'Cơ Thổ Kê', loai: 'Tốt', moTa: 'Tướng tinh con gà.', nen: 'Tốt cho xây dựng và cưới gả.', ky: 'Không kỵ gì.', ngoaiLe: '' },
    Đẩu: { sao: 'Đẩu Mộc Giải', loai: 'Xấu', moTa: 'Tướng tinh con rái cá.', nen: 'Không có việc gì thuận lợi.', ky: 'Kỵ xuất hành.', ngoaiLe: '' },
    Ngưu: { sao: 'Ngưu Kim Ngưu', loai: 'Xấu', moTa: 'Tướng tinh con trâu.', nen: 'Không tốt cho việc lớn.', ky: 'Kỵ an táng.', ngoaiLe: '' },
    Nữ: { sao: 'Nữ Thổ Bức', loai: 'Xấu', moTa: 'Tướng tinh con dơi.', nen: 'Không nên làm việc trọng đại.', ky: 'Kỵ cưới hỏi.', ngoaiLe: '' },
    Hư: { sao: 'Hư Nhật Thử', loai: 'Xấu', moTa: 'Tướng tinh con chuột.', nen: 'Không nên làm gì.', ky: 'Đại kỵ chôn cất.', ngoaiLe: '' },
    Nguy: { sao: 'Nguy Nguyệt Yến', loai: 'Xấu', moTa: 'Tướng tinh con chim yến.', nen: 'Không nên khởi sự.', ky: 'Kỵ cưới hỏi.', ngoaiLe: '' },
    Thất: { sao: 'Thất Hỏa Trư', loai: 'Tốt', moTa: 'Tướng tinh con heo.', nen: 'Tốt cho cưới hỏi, xây dựng.', ky: 'Kỵ chôn cất.', ngoaiLe: '' },
    Bích: { sao: 'Bích Thủy Du', loai: 'Xấu', moTa: 'Tướng tinh con cá.', nen: 'Không nên làm việc lớn.', ky: 'Kỵ khai trương.', ngoaiLe: '' },
    Khuê: { sao: 'Khuê Mộc Lang', loai: 'Tốt', moTa: 'Tướng tinh con chó sói.', nen: 'Tốt cho mọi việc.', ky: 'Kỵ chôn cất.', ngoaiLe: '' },
    Lâu: { sao: 'Lâu Kim Cẩu', loai: 'Tốt', moTa: 'Tướng tinh con chó.', nen: 'Tốt cho khởi sự.', ky: 'Không kỵ.', ngoaiLe: '' },
    Vị: { sao: 'Vị Thổ Trĩ', loai: 'Tốt', moTa: 'Tướng tinh con gà rừng.', nen: 'Tốt mọi việc.', ky: 'Kỵ an táng.', ngoaiLe: '' },
    Mão: { sao: 'Mão Nhật Kê', loai: 'Xấu', moTa: 'Tướng tinh con gà.', nen: 'Không nên làm việc lớn.', ky: 'Kỵ cưới hỏi.', ngoaiLe: '' },
    Tất: { sao: 'Tất Nguyệt Ô', loai: 'Tốt', moTa: 'Tướng tinh con quạ.', nen: 'Tốt cho việc nhỏ.', ky: 'Kỵ chôn cất.', ngoaiLe: '' },
    Chủy: { sao: 'Chủy Hỏa Hầu', loai: 'Xấu', moTa: 'Tướng tinh con khỉ.', nen: 'Không nên khởi sự.', ky: 'Kỵ khai trương.', ngoaiLe: '' },
    Sâm: { sao: 'Sâm Thủy Viên', loai: 'Xấu', moTa: 'Tướng tinh con vượn.', nen: 'Không tốt.', ky: 'Kỵ làm nhà.', ngoaiLe: '' },
    Tỉnh: { sao: 'Tỉnh Mộc Hổ', loai: 'Tốt', moTa: 'Tướng tinh con hổ.', nen: 'Tốt cho xây dựng.', ky: 'Kỵ chôn cất.', ngoaiLe: '' },
    Quỷ: { sao: 'Quỷ Kim Dương', loai: 'Xấu', moTa: 'Tướng tinh con dê.', nen: 'Không làm việc lớn.', ky: 'Kỵ cưới hỏi.', ngoaiLe: '' },
    Liễu: { sao: 'Liễu Thủy Hầu', loai: 'Xấu', moTa: 'Tướng tinh con khỉ nước.', nen: 'Không tốt.', ky: 'Kỵ chôn cất.', ngoaiLe: '' },
    Tinh: { sao: 'Tinh Nhật Mã', loai: 'Tốt', moTa: 'Tướng tinh con ngựa.', nen: 'Tốt cho mọi việc.', ky: 'Kỵ an táng.', ngoaiLe: '' },
    Trương: { sao: 'Trương Nguyệt Lộc', loai: 'Tốt', moTa: 'Tướng tinh con nai.', nen: 'Tốt cho cầu tài.', ky: 'Không kỵ.', ngoaiLe: '' },
    Dực: { sao: 'Dực Hỏa Xà', loai: 'Xấu', moTa: 'Tướng tinh con rắn.', nen: 'Nếu cắt áo sẽ sinh tài.', ky: 'Kỵ chôn cất, xây nhà, cưới hỏi.', ngoaiLe: 'Tại Thân - Tý - Thìn rất tốt.' },
    Chẩn: { sao: 'Chẩn Thổ Trĩ', loai: 'Tốt', moTa: 'Tướng tinh con gà.', nen: 'Tốt cho mọi việc.', ky: 'Kỵ mai táng.', ngoaiLe: '' },
  };

  readonly TRUC_ORDER = ['Kiến', 'Trừ', 'Mãn', 'Bình', 'Định', 'Chấp', 'Phá', 'Nguy', 'Thành', 'Thu', 'Khai', 'Bế'];
  readonly TRUC: Record<string, { tot: string; xau: string }> = {
    Kiến: { tot: 'Khai trương, nhậm chức, cưới hỏi, trồng cây, xuất hành tốt.', xau: 'Kỵ động thổ, chôn cất, đào giếng, lợp nhà.' },
    Trừ: { tot: 'Tốt cho phá dỡ, bỏ cái cũ để làm cái mới.', xau: 'Kỵ cưới hỏi và xây dựng.' },
    Mãn: { tot: 'Tốt cho cưới hỏi, cầu tài, cầu phúc.', xau: 'Kỵ kiện tụng.' },
    Bình: { tot: 'Tốt cho việc nhỏ, bình ổn.', xau: 'Kỵ việc lớn.' },
    Định: { tot: 'Tốt cho cưới hỏi, cầu tài.', xau: 'Kỵ kiện tụng, động thổ.' },
    Chấp: { tot: 'Tốt cho xây cất, cầu phúc.', xau: 'Kỵ xuất hành.' },
    Phá: { tot: 'Tốt cho phá bỏ, dỡ nhà.', xau: 'Xấu cho mọi việc lớn.' },
    Nguy: { tot: 'Không có việc tốt rõ ràng.', xau: 'Rất xấu, đại kỵ cưới hỏi.' },
    Thành: { tot: 'Cầu tài, cưới hỏi, xây cất, khai trương.', xau: 'Kỵ kiện tụng.' },
    Thu: { tot: 'Thu hoạch, nhập kho.', xau: 'Kỵ xuất tiền.' },
    Khai: { tot: 'Khai trương, mở hàng, xuất hành.', xau: 'Kỵ an táng.' },
    Bế: { tot: 'Không có việc tốt.', xau: 'Đại hung, tránh mọi việc quan trọng.' },
  };

  readonly HUONG_XUAT_HANH: Record<string, string> = { HyThan: 'Chính Nam', TaiThan: 'Chính Tây', KyThan: 'Đông Bắc', GiaiThan: 'Đông Nam', PhucThan: 'Bắc' };
  readonly GIO_XUAT_HANH_LY_THUAN_PHONG: Record<string, string> = {
    Tý: 'Cầu tài không lợi, hay gặp chuyện trái ý. Dễ gặp nạn. Nếu làm việc quan trọng phải cúng tế.',
    Sửu: 'Mọi việc tốt lành, cầu tài được. Xuất hành hướng Tây Nam càng tốt.',
    Dần: 'Mưu sự khó thành, cầu tài mờ mịt. Kiện cáo nên hoãn. Dễ mất tiền.',
    Mão: 'Tin vui sắp đến. Cầu tài đi hướng Nam rất tốt. Chăn nuôi thuận lợi.',
    Thìn: 'Dễ sinh tranh cãi, gặp chuyện đói kém. Người ra đi nên hoãn lại.',
    Tỵ: 'Giờ rất tốt, gặp nhiều may mắn. Kinh doanh có lợi, gia đạo hòa hợp.',
    Ngọ: 'Cầu tài không lợi, hay gặp thất ý. Người đi xa hay gặp nạn.',
    Mùi: 'Mọi việc tốt lành. Xuất hành Tây Nam đại cát.',
    Thân: 'Mưu việc khó thành. Kiện cáo nên hoãn. Dễ mất của.',
    Dậu: 'Tin vui đến. Cầu lộc đi hướng Nam rất tốt.',
    Tuất: 'Cãi vã, thị phi, không nên làm việc quan trọng.',
    Hợi: 'Rất tốt, kinh doanh thuận lợi, người đi xa sắp về.',
  };

  readonly CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
  readonly CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
  readonly NGU_HANH_CAN: Record<string, string> = { Giáp: 'Mộc', Ất: 'Mộc', Bính: 'Hỏa', Đinh: 'Hỏa', Mậu: 'Thổ', Kỷ: 'Thổ', Canh: 'Kim', Tân: 'Kim', Nhâm: 'Thủy', Quý: 'Thủy' };
  readonly NGU_HANH_CHI: Record<string, string> = { Tý: 'Thủy', Sửu: 'Thổ', Dần: 'Mộc', Mão: 'Mộc', Thìn: 'Thổ', Tỵ: 'Hỏa', Ngọ: 'Hỏa', Mùi: 'Thổ', Thân: 'Kim', Dậu: 'Kim', Tuất: 'Thổ', Hợi: 'Thủy' };
  readonly NGU_HANH_SINH: Record<string, string> = { Mộc: 'Hỏa', Hỏa: 'Thổ', Thổ: 'Kim', Kim: 'Thủy', Thủy: 'Mộc' };
  readonly NGU_HANH_KHAC: Record<string, string> = { Mộc: 'Thổ', Thổ: 'Thủy', Thủy: 'Hỏa', Hỏa: 'Kim', Kim: 'Mộc' };

  readonly NAP_AM: Record<string, string> = {
    'Giáp Tý': 'Hải Trung Kim',
    'Ất Sửu': 'Hải Trung Kim',
    'Bính Dần': 'Lư Trung Hỏa',
    'Đinh Mão': 'Lư Trung Hỏa',
    'Mậu Thìn': 'Đại Lâm Mộc',
    'Kỷ Tỵ': 'Đại Lâm Mộc',
    'Canh Ngọ': 'Lộ Bàng Thổ',
    'Tân Mùi': 'Lộ Bàng Thổ',
    'Nhâm Thân': 'Kiếm Phong Kim',
    'Quý Dậu': 'Kiếm Phong Kim',
    'Giáp Tuất': 'Sơn Đầu Hỏa',
    'Ất Hợi': 'Sơn Đầu Hỏa',
    'Bính Tý': 'Giản Hạ Thủy',
    'Đinh Sửu': 'Giản Hạ Thủy',
    'Mậu Dần': 'Thành Đầu Thổ',
    'Kỷ Mão': 'Thành Đầu Thổ',
    'Canh Thìn': 'Bạch Lạp Kim',
    'Tân Tỵ': 'Bạch Lạp Kim',
    'Nhâm Ngọ': 'Dương Liễu Mộc',
    'Quý Mùi': 'Dương Liễu Mộc',
    'Giáp Thân': 'Tuyền Trung Thủy',
    'Ất Dậu': 'Tuyền Trung Thủy',
    'Bính Tuất': 'Ốc Thượng Thổ',
    'Đinh Hợi': 'Ốc Thượng Thổ',
    'Mậu Tý': 'Tích Lịch Hỏa',
    'Kỷ Sửu': 'Tích Lịch Hỏa',
    'Canh Dần': 'Tùng Bách Mộc',
    'Tân Mão': 'Tùng Bách Mộc',
    'Nhâm Thìn': 'Trường Lưu Thủy',
    'Quý Tỵ': 'Trường Lưu Thủy',
    'Giáp Ngọ': 'Sa Trung Kim',
    'Ất Mùi': 'Sa Trung Kim',
    'Bính Thân': 'Sơn Hạ Hỏa',
    'Đinh Dậu': 'Sơn Hạ Hỏa',
    'Mậu Tuất': 'Bình Địa Mộc',
    'Kỷ Hợi': 'Bình Địa Mộc',
    'Canh Tý': 'Bích Thượng Thổ',
    'Tân Sửu': 'Bích Thượng Thổ',
    'Nhâm Dần': 'Kim Bạch Kim',
    'Quý Mão': 'Kim Bạch Kim',
    'Giáp Thìn': 'Phúc Đăng Hỏa',
    'Ất Tỵ': 'Phúc Đăng Hỏa',
    'Bính Ngọ': 'Thiên Hà Thủy',
    'Đinh Mùi': 'Thiên Hà Thủy',
    'Mậu Thân': 'Đại Trạch Thổ',
    'Kỷ Dậu': 'Đại Trạch Thổ',
    'Canh Tuất': 'Thoa Xuyến Kim',
    'Tân Hợi': 'Thoa Xuyến Kim',
    'Nhâm Tý': 'Tang Đố Mộc',
    'Quý Sửu': 'Tang Đố Mộc',
    'Giáp Dần': 'Đại Khê Thủy',
    'Ất Mão': 'Đại Khê Thủy',
    'Bính Thìn': 'Sa Trung Thổ',
    'Đinh Tỵ': 'Sa Trung Thổ',
    'Mậu Ngọ': 'Thiên Thượng Hỏa',
    'Kỷ Mùi': 'Thiên Thượng Hỏa',
    'Canh Thân': 'Thạch Lựu Mộc',
    'Tân Dậu': 'Thạch Lựu Mộc',
    'Nhâm Tuất': 'Đại Hải Thủy',
    'Quý Hợi': 'Đại Hải Thủy',
  };

  readonly NGOC_HAP_SAO_TOT_FULL: Record<string, string> = {
    'Thiên Đức': 'Tốt mọi việc.',
    'Nguyệt Đức': 'Tốt mọi việc.',
    'Thiên Quý': 'Quý nhân phù trợ, cực tốt.',
    'Thiên Xá': 'Tốt giải oan, giải nạn.',
    'Thiên Ân': 'Cầu phúc, tế tự tốt.',
    'Thiên Phúc': 'Tốt cho cưới hỏi, sinh con.',
    'Thiên Tài': 'Cầu tài đại cát.',
    'Nguyệt Tài': 'Cầu tài vừa phải.',
    'Thiên Hỷ': 'Cưới hỏi đại cát.',
    'Phúc Sinh': 'Tốt cho cầu phúc, cầu con.',
    'Sinh Khí': 'Động thổ, khai trương cực tốt.',
    'Thiên Mã': 'Xuất hành tốt.',
    'Dịch Mã': 'Xuất hành, giao dịch tốt.',
    'Tứ Phú': 'Cầu tài tốt.',
    'Kim Quỹ': 'Khai trương, mở kho tốt.',
    'Ngọc Đường': 'Tốt việc quan, bổ nhiệm.',
  };

  readonly NGOC_HAP_SAO_XAU_FULL: Record<string, string> = {
    'Trùng Tang': 'Rất xấu, kỵ cưới, an táng.',
    'Trùng Phục': 'Kỵ cưới hỏi, xây nhà.',
    'Bạch Hổ': 'Xấu khi an táng.',
    'Huyết Sát': 'Xấu về máu huyết.',
    'Tam Nương': '6 ngày cực xấu: mùng 3,7,13,18,22,27',
    'Sát Chủ': 'Xấu khi động thổ.',
    'Không Phòng': 'Xấu khi cưới hỏi.',
    'Nguyệt Hư': 'Xấu mọi việc.',
    'Nguyệt Hình': 'Xấu, dễ kiện tụng.',
    'Nguyệt Phá': 'Xấu khi xây dựng.',
    'Thổ Cấm': 'Xấu phá thổ.',
    'Thiên Cương': 'Đại hung.',
    'Địa Tặc': 'Dễ mất mát.',
    'Ngũ Quỷ': 'Đại hung.',
    'Hoang Vu': 'Xấu mọi việc lớn.',
    'Lục Bất Thành': 'Việc khó thành.',
    'Ly Sàng': 'Xấu về hôn nhân.',
    'Cô Thần': 'Xấu cưới hỏi.',
    'Quả Tú': 'Xấu cưới hỏi.',
    'Hỏa Tai': 'Dễ cháy nổ.',
    'Tán Tận': 'Mất tiền của.',
    'Đại Không Vong': 'Đại hung.',
  };

  readonly SAO_TOT_CAN: Record<string, string[]> = {
    Giáp: ['Thiên Đức'],
    Ất: ['Thiên Đức'],
    Bính: ['Thiên Hỷ'],
    Đinh: ['Kim Quỹ'],
    Mậu: ['Nguyệt Đức'],
    Kỷ: ['Nguyệt Đức'],
    Canh: ['Thiên Quý'],
    Tân: ['Thiên Ân'],
    Nhâm: ['Thiên Phúc'],
    Quý: ['Thiên Phúc'],
  };

  readonly SAO_XAU_CAN: Record<string, string[]> = {
    Giáp: ['Trùng Tang'],
    Ất: ['Trùng Phục'],
    Bính: ['Không Phòng'],
    Đinh: ['Ly Sàng'],
    Mậu: ['Huyết Sát'],
    Kỷ: ['Huyết Sát'],
    Canh: ['Nguyệt Hư'],
    Tân: ['Nguyệt Hư'],
    Nhâm: ['Thiên Cương'],
    Quý: ['Thiên Cương'],
  };

  readonly SAO_XAU_CHI: Record<string, string[]> = {
    Tý: ['Huyết Sát'],
    Sửu: ['Hoang Vu'],
    Dần: ['Nguyệt Hình'],
    Mão: ['Nguyệt Phá'],
    Thìn: ['Thổ Cấm'],
    Tỵ: ['Tam Nương'],
    Ngọ: ['Ngũ Quỷ'],
    Mùi: ['Tán Tận'],
    Thân: ['Địa Tặc'],
    Dậu: ['Không Phòng'],
    Tuất: ['Bạch Hổ'],
    Hợi: ['Trùng Tang'],
  };

  readonly NHI_THAP_BAT_TU_LIST = [
    'Giác',
    'Cang',
    'Đê',
    'Phòng',
    'Tâm',
    'Vĩ',
    'Cơ',
    'Đẩu',
    'Ngưu',
    'Nữ',
    'Hư',
    'Nguy',
    'Thất',
    'Bích',
    'Khuê',
    'Lâu',
    'Vị',
    'Mão',
    'Tất',
    'Chủy',
    'Sâm',
    'Tỉnh',
    'Quỷ',
    'Liễu',
    'Tinh',
    'Trương',
    'Dực',
    'Chẩn',
  ];

  readonly OFFSET_28_TU = -90;
  readonly TRUC_OFFSET = 1;
}

