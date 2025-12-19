import { Injectable } from "@angular/core";
import { DS_SAO_HAC_DAO, DS_SAO_HOANG_DAO } from "../data";

@Injectable({ providedIn: "root" })
export class NgayHoangDao {
  readonly CHI_TO_INDEX: Record<string, number> = {
    Dần: 1,
    Mão: 2,
    Thìn: 3,
    Tỵ: 4,
    Ngọ: 5,
    Mùi: 6,
    Thân: 7,
    Dậu: 8,
    Tuất: 9,
    Hợi: 10,
    Tý: 11,
    Sửu: 12,
  };

  // NGAY_HOANG_DAO_THANG: Key là số thứ tự Chi Tháng (1=Dần, 10=Hợi, 11=Tý, 12=Sửu)
  readonly NGAY_HOANG_DAO_THANG: Record<number, string[]> = {
    1: ["Tý", "Sửu", "Thìn", "Tỵ", "Mùi", "Tuất"], // Dần
    2: ["Dần", "Mão", "Ngọ", "Mùi", "Dậu", "Tý"], // Mão
    3: ["Thìn", "Tỵ", "Thân", "Dậu", "Hợi", "Dần"], // Thìn
    4: ["Ngọ", "Mùi", "Tuất", "Hợi", "Sửu", "Thìn"], // Tỵ
    5: ["Thân", "Dậu", "Tý", "Sửu", "Mão", "Ngọ"], // Ngọ
    6: ["Tuất", "Hợi", "Dần", "Mão", "Tỵ", "Thân"], // Mùi
    7: ["Tý", "Sửu", "Thìn", "Tỵ", "Mùi", "Tuất"], // Thân
    8: ["Dần", "Mão", "Ngọ", "Mùi", "Dậu", "Tý"], // Dậu
    9: ["Thìn", "Tỵ", "Thân", "Dậu", "Hợi", "Dần"], // Tuất
    10: ["Ngọ", "Mùi", "Tuất", "Hợi", "Sửu", "Thìn"], // Hợi (Tháng 10 Âm lịch)
    11: ["Thân", "Dậu", "Tý", "Sửu", "Mão", "Ngọ"], // Tý (Tháng 11 Âm lịch)
    12: ["Tuất", "Hợi", "Dần", "Mão", "Tỵ", "Thân"], // Sửu (Tháng 12 Âm lịch)
  };

  // // NGAY_HAC_DAO_THANG: Key là số thứ tự Chi Tháng (1=Dần, 10=Hợi, 11=Tý, 12=Sửu)
  readonly NGAY_HAC_DAO_THANG: Record<number, string[]> = {
    1: ["Dần", "Mão", "Ngọ", "Thân", "Dậu", "Hợi"], // Dần
    2: ["Thìn", "Tỵ", "Thân", "Tuất", "Hợi", "Sửu"], // Mão
    3: ["Ngọ", "Mùi", "Tuất", "Tý", "Sửu", "Mão"], // Thìn
    4: ["Thân", "Dậu", "Tý", "Dần", "Mão", "Tỵ"], // Tỵ
    5: ["Tuất", "Hợi", "Dần", "Thìn", "Tỵ", "Mùi"], // Ngọ
    6: ["Tý", "Sửu", "Thìn", "Ngọ", "Mùi", "Dậu"], // Mùi
    7: ["Dần", "Mão", "Ngọ", "Thân", "Dậu", "Hợi"], // Thân
    8: ["Thìn", "Tỵ", "Thân", "Tuất", "Hợi", "Sửu"], // Dậu
    9: ["Ngọ", "Mùi", "Tuất", "Tý", "Sửu", "Mão"], // Tuất
    10: ["Thân", "Dậu", "Tý", "Dần", "Mão", "Tỵ"], // Hợi (Tháng 10 Âm lịch)
    11: ["Tuất", "Hợi", "Dần", "Thìn", "Tỵ", "Mùi"], // Tý
    12: ["Tý", "Sửu", "Thìn", "Ngọ", "Mùi", "Dậu"], // Sửu
  };

  private getSaoHoangDao(index: number) {
    return DS_SAO_HOANG_DAO[index] || null;
  }

  private getSaoHacDao(index: number) {
    return DS_SAO_HAC_DAO[index] || null;
  }

  getHoangDaoStatus(chiNgay: string, chiThang: string) {
    // const hoangDaoList = this.NGAY_HOANG_DAO[chiThang];

    const chiThangIndex = this.CHI_TO_INDEX[chiThang];
    const isHoangDao = this.NGAY_HOANG_DAO_THANG[chiThangIndex].includes(chiNgay);
    const isHacDao = this.NGAY_HAC_DAO_THANG[chiThangIndex].includes(chiNgay);

    if (isHoangDao) {
      const saoHDidx = this.NGAY_HOANG_DAO_THANG[chiThangIndex].indexOf(chiNgay);
      return {
        type: "Hoàng đạo",
        good: true,
        sao: this.getSaoHoangDao(saoHDidx), // ví dụ Kim Quỹ, Thanh Long…
      };
    } else if (isHacDao) {
      const saoHDidx = this.NGAY_HAC_DAO_THANG[chiThangIndex].indexOf(chiNgay);
      return {
        type: "Hắc đạo",
        good: false,
        sao: this.getSaoHacDao(saoHDidx), // ví dụ Bạch Hổ, Chu Tước…
      };
    } else {
      return null;
    }
  }
}
