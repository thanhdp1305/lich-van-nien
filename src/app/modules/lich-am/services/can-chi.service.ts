import { Injectable } from "@angular/core";
import { AmLich } from "./am-lich.service";


@Injectable({ providedIn: "root" })
export class CanChi {
  readonly CAN = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
  readonly CHI = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];

  constructor(
    private amLich: AmLich
  ) {}

  getCanChiNgay(jdn: number): string {
    const can = this.CAN[(jdn + 9) % 10];
    const chi = this.CHI[(jdn + 1) % 12];
    return `${can} ${chi}`;
  }

  getCanChiThang(canNamIndex: number, thangAm: number): string {
    // Index của Can tháng Dần (tháng 1 Âm lịch)
    const canThangDich = (canNamIndex * 2 + 2) % 10;

    // Can tháng = (Can tháng Dần + (tháng Âm - 1)) mod 10
    const canIndex = (canThangDich + (thangAm - 1)) % 10;

    // Chi tháng = (tháng Âm + 1) mod 12 (vì Chi Tý index 0, Chi Dần index 2)
    const chiIndex = (thangAm + 1) % 12;

    return `${this.CAN[canIndex]} ${this.CHI[chiIndex]}`;
  }

  getCanChiNam(nam: number): string {
    const can = this.CAN[(nam + 6) % 10];
    const chi = this.CHI[(nam + 8) % 12];
    return `${can} ${chi}`;
  }

  getCanChiNgayAm(dateInput: string | Date): any {
    const { jdn, lunar } = this.amLich.getJdnAndLunar(dateInput);
    const canChiNgay = this.getCanChiNgay(jdn);
    const [canNgay, chiNgay] = canChiNgay.split(" ");
    const canChiNam = this.getCanChiNam(lunar.lunarYear);
    const canNamIndex = (lunar.lunarYear + 6) % 10;
    const canChiThang = this.getCanChiThang(canNamIndex, lunar.lunarMonth);
    const [canThang, chiThang] = canChiThang.split(" ");
    const [canNam, chiNam] = canChiNam.split(" ");

    return {
      canNgay,
      chiNgay,
      canThang,
      chiThang,
      canNam,
      chiNam
    }
  }
}