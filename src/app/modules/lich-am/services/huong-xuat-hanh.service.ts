import { Injectable } from "@angular/core";

// A. HỶ THẦN:

// Vận hành qua 5 hướng ngược chiều kim đồng hồ, theo thứ tự:

// - Ngày Giáp và ngày Kỷ: Hướng Đông bắc

// - Ngày Ất và ngày Canh: Hướng Tây Bắc

// - Ngày Bính và ngày Tân: Hướng Tây Nam

// - Ngày Đinh và ngày Nhâm: Hướng chính Nam

// - Ngày Mậu và  ngày Quý: Hướng Đông Nam

// B. TÀI THẦN:

// Vận hành theo ngày hàng Can theo 7 hướng (trừ Đông bắc)

// - Ngày Giáp và ngày Ất: Hướng Đông Nam

// - Ngày Bính và ngày Đinh: Hướng Đông

// - Ngày Mậu: Hướng Bắc

// - Ngày Kỷ: Hướng Nam

// - Ngày Canh và ngày Tân: Hướng Tây Nam

// - Ngày Nhâm: Hướng Tây

// - Ngày Quý: Hướng Tây Bắc.

// Những ngày còn lại (44), thì Hạc Thần đi tuần du khắp 8 hướng, theo trình tự các ngày (can chi) như sau:

// - Kỷ Dậu, Canh Tuất, Tân Hợi, Nhâm Tý, Quý Sửu, Giáp Dần: Hướng đông bắc.

// - Ất Mão, Bính Thìn, Đinh Tỵ, Mậu Ngọ, Kỷ Mùi: Hướng Đông

// - Canh Thân, Tân Dậu, Nhâm Tuất, Quý Hợi, Giáp Tý, Ất Sửu: Hướng đông nam

// - Bính Dần, Đinh Mão, Mậu Thìn, Kỷ Tỵ, Canh Ngọ: Hướng nam.

// - Tân Mùi, Nhâm Thân, Quý Dậu, Giáp Tuất, Ất Hợi, Bính Tý: Hướng tây nam

// - Đinh Sửu, Mậu Dần, Kỷ Mão, Canh Thìn, Tân Tỵ: Hướng tây

// - Nhâm Ngọ, Quý Mùi, Giáp Thân, Ất Dậu, Bính Tuất, Đinh Hợi: Hướng tây bắc

// - Mậu Tý, Kỷ Sửu, Canh Dần, Tân Mão, Nhâm Thìn: Hướng bắc

@Injectable({ providedIn: "root" })
export class HuongXuatHanh {
  readonly HUONG_XUAT_HANH: Record<string, string> = {
    HyThan: "Chính Nam",
    TaiThan: "Chính Tây",
    KyThan: "Đông Bắc",
    GiaiThan: "Đông Nam",
    PhucThan: "Bắc",
  };

  readonly HY_THAN_NGAY_CAN: Record<string, string> = {
    Giáp: "Đông Bắc",
    Ất: "Tây Bắc",
    Bính: "Tây Nam",
    Đinh: "Chính Nam",
    Mậu: "Đông Nam",
    Kỷ: "Đông Bắc",
    Canh: "Tây Bắc",
    Tân: "Tây Nam",
    Nhâm: "Chính Nam",
    Quý: "Đông Nam",
  };

  readonly TAI_THAN_NGAY_CAN: Record<string, string> = {
    Giáp: "Đông Nam",
    Ất: "Đông Nam",
    Bính: "Đông",
    Đinh: "Đông",
    Mậu: "Bắc",
    Kỷ: "Nam",
    Canh: "Tây Nam",
    Tân: "Tây Nam",
    Nhâm: "Tây",
    Quý: "Tây Bắc",
  };

  readonly HAC_THAN_NGAY_CAN_CHI: Record<string | number, string[]> = {
    0: ["Kỷ Dậu", "Canh Tuất", "Tân Hợi", "Nhâm Tý", "Quý Sửu", "Giáp Dần"],
    1: ["Ất Mão", "Bính Thìn", "Đinh Tỵ", "Mậu Ngọ", "Kỷ Mùi"],
    2: ["Canh Thân", "Tân Dậu", "Nhâm Tuất", "Quý Hợi", "Giáp Tý", "Ất Sửu"],
    3: ["Bính Dần", "Đinh Mão", "Mậu Thìn", "Kỷ Tỵ", "Canh Ngọ"],
    4: ["Tân Mùi", "Nhâm Thân", "Quý Dậu", "Giáp Tuất", "Ất Hợi", "Bính Tý"],
    5: ["Đinh Sửu", "Mậu Dần", "Kỷ Mão", "Canh Thìn", "Tân Tỵ"],
    6: ["Nhâm Ngọ", "Quý Mùi", "Giáp Thân", "Ất Dậu", "Bính Tuất", "Đinh Hợi"],
    7: ["Mậu Tý", "Kỷ Sửu", "Canh Dần", "Tân Mão", "Nhâm Thìn"],
  };

  readonly HAC_THAN_HUONG_MAPS = ["Đông Bắc", "Đông", "Đông Nam", "Nam", "Tây Nam", "Tây", "Tây Bắc", "Bắc"];

  getHuongXuatHanh(canNgay: string): Record<string, string> {
    return {
      "Hỷ Thần": this.HY_THAN_NGAY_CAN[canNgay] || "Không xác định",
      "Tài Thần": this.TAI_THAN_NGAY_CAN[canNgay] || "Không xác định",
    };
  }

  getHuongHacThan(canChiNgay: string): string {
    for (const [index, canChiArray] of Object.entries(this.HAC_THAN_NGAY_CAN_CHI)) {
      if (canChiArray.includes(canChiNgay)) {
        return this.HAC_THAN_HUONG_MAPS[parseInt(index)];
      }
    }
    return "Không xác định";
  }
}