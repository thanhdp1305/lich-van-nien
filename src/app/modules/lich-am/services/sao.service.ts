import { Injectable } from "@angular/core";
import { NhiThapBatTuItem } from "./nhi-thap-bat-tu.service";
import { TrucItem } from "./truc.service";
import { NGOC_HAP_SAO_TOT_FULL, NGOC_HAP_SAO_XAU_FULL, SAO_DAC_BIET, SAO_TOT_CAN, SAO_TOT_CHI, SAO_TOT_THANG, SAO_XAU_CAN, SAO_XAU_CHI, SAO_XAU_THANG } from "../data";

@Injectable({ providedIn: "root" })
export class Sao {
  get saoTotTieuBieu(): string[] {
    return Object.keys(NGOC_HAP_SAO_TOT_FULL).slice(0, 6);
  }

  get saoXauTieuBieu(): string[] {
    return Object.keys(NGOC_HAP_SAO_XAU_FULL).slice(0, 6);
  }

  // ----------------- MARK: Helpers -----------------

  /**
   * Hàm tổng hợp các sao Cát (Tốt) và Hung (Xấu) dựa trên Can Chi ngày, Trực, Hoàng Đạo/Hắc Đạo.
   * @param lunar Chi tiết ngày Âm lịch đã tính.
   * @returns { SaoDetail } Danh sách các sao tốt và sao xấu.
   */
    getSaoTotSaoXau(
    canNgay: string,
    chiNgay: string,
    chiThang: string,
    truc: TrucItem,
    nhiThapBatTu: NhiThapBatTuItem,
    hoangDaoStatus: { type: string; good: boolean; sao: string },
  ): { saoTot: string[]; saoXau: string[] } {
    const saoTot: string[] = [];
    const saoXau: string[] = [];

    // 1. Sao Tốt/Xấu theo Can Ngày (SAO_TOT_CAN, SAO_XAU_CAN)
    if (SAO_TOT_CAN[canNgay]) {
      saoTot.push(...SAO_TOT_CAN[canNgay]);
    }
    if (SAO_XAU_CAN[canNgay]) {
      saoXau.push(...SAO_XAU_CAN[canNgay]);
    }

    // 2. Sao Tốt/Xấu theo Chi Ngày (SAO_TOT_CHI, SAO_XAU_CHI)
    if (SAO_TOT_CHI[chiNgay]) {
      saoTot.push(...SAO_TOT_CHI[chiNgay]);
    }
    if (SAO_XAU_CHI[chiNgay]) {
      saoXau.push(...SAO_XAU_CHI[chiNgay]);
    }

    // Sao Tốt/Xấu theo CHI THÁNG
    if (SAO_TOT_THANG[chiThang]) {
      saoTot.push(...SAO_TOT_THANG[chiThang]);
    }
    if (SAO_XAU_THANG[chiThang]) {
      saoXau.push(...SAO_XAU_THANG[chiThang]);
    }

    if (SAO_DAC_BIET[chiThang]) {
      saoTot.push(...SAO_DAC_BIET[chiThang]);
    }

    // 3. Sao Hoàng Đạo/Hắc Đạo
    // Thêm tên sao Hoàng Đạo/Hắc Đạo vào danh sách.
    // if (hoangDaoStatus.good) {
    //   saoTot.push(hoangDaoStatus.sao); // Kim Quỹ, Thanh Long, v.v.
    // } else {
    //   saoXau.push(hoangDaoStatus.sao); // Bạch Hổ, Chu Tước, v.v.
    // }

    // 4. Đánh giá từ Nhị Thập Bát Tú (Sao)
    // Nếu Sao tốt/xấu của Nhị Thập Bát Tú rõ ràng, thêm vào danh sách.
    const nhiTuLoai = nhiThapBatTu.data.loai;
    if (nhiTuLoai === "Cát") {
      saoTot.push(`Sao ${nhiThapBatTu.data.sao} (Tốt)`);
    } else if (nhiTuLoai === "Hung") {
      saoXau.push(`Sao ${nhiThapBatTu.data.sao} (Xấu)`);
    }

    // 5. Đánh giá từ Trực
    // Nếu Trực được xem là Tốt (Cát), thêm Trực vào sao tốt.
    // Thường Trực Kiến, Mãn, Bình, Định, Chấp, Khai được coi là Tốt
    // Trực Phá, Nguy, Thu, Bế được coi là Xấu
    const trucKey = truc.key;
    if (["Mãn", "Bình", "Định", "Chấp", "Khai"].includes(trucKey)) {
      saoTot.push(`Trực ${trucKey} (Cát)`);
    } else if (["Phá", "Nguy", "Thu", "Bế"].includes(trucKey)) {
      saoXau.push(`Trực ${trucKey} (Hung)`);
    } else {
      // Trường hợp còn lại (Kiến, Trừ) thường là trung bình hoặc có ngoại lệ
      // Có thể để trống hoặc thêm ghi chú nếu cần chi tiết hơn.
    }

    // 6. Loại bỏ các sao trùng lặp và trả về
    const uniqueSaoTot = [...new Set(saoTot)].filter((s) => s?.trim() !== "");
    const uniqueSaoXau = [...new Set(saoXau)].filter((s) => s?.trim() !== "");

    return { saoTot: uniqueSaoTot, saoXau: uniqueSaoXau };
  }
}