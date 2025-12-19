import { Injectable } from "@angular/core";
import { KHUNG_GIO, NGU_HANH_CAN, NGU_HANH_CHI } from "../data";
import { AmLich } from "./am-lich.service";
import { CanChi } from "./can-chi.service";
import { NguHanh } from "./ngu-hanh.service";
import { HuongXuatHanh } from "./huong-xuat-hanh.service";
import { Truc, TrucItem } from "./truc.service";
import { NapAm } from "./nap-am.service";
import { LucDieu } from "./luc-dieu.service";
import { GioXuatHanh, GioXuatHanhItem } from "./gio-xuat-hanh.service";
import { TietKhi } from "./tiet-khi.service";
import { NgayHoangDao } from "./ngay-hoang-dao.service";
import { XungHop, XungHopValue } from "./xung-hop.service";
import { NhiThapBatTu, NhiThapBatTuItem } from "./nhi-thap-bat-tu.service";
import { BanhTo } from "./banh-to.service";

export type NgocHapItem = { k: string; type: "good" | "bad"; v: string };
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
  hacThan: string;
  gioXuatHanhNotes: GioXuatHanhItem[];
  textSummary?: string;
  tietKhi: any;
  ngayHoangDao: any;
  saoTot: string[]; // Thêm trường này
  saoXau: string[]; // Thêm trường này
};

@Injectable({ providedIn: "root" })
export class DateDetailService {
  constructor(
    private amLich: AmLich,
    private canChi: CanChi,
    private nguHanh: NguHanh,
    private huongXuatHanh: HuongXuatHanh,
    private truc: Truc,
    private napAm: NapAm,
    private lucDieu: LucDieu,
    private gioXuatHanh: GioXuatHanh,
    private tietKhi: TietKhi,
    private ngayHoangDao: NgayHoangDao,
    private xungHop: XungHop,
    private nhiThapBatTu: NhiThapBatTu,
    private banhTo: BanhTo
  ) {}


  /** API chính: lấy thông tin chi tiết cho 1 ngày (ISO string hoặc Date) */
  getDayDetail(dateInput: string | Date): DayDetail {
    const tz = 7;
    const d = typeof dateInput === "string" ? new Date(dateInput) : new Date(dateInput);
    const dd = d.getDate();
    const mm = d.getMonth() + 1;
    const yy = d.getFullYear();
    const jdn = this.amLich.jdFromDate(dd, mm, yy);
    const lunar = this.amLich.convertSolar2Lunar(dd, mm, yy, tz);
    const canChiNgay = this.canChi.getCanChiNgay(jdn);
    const [canNgay, chiNgay] = canChiNgay.split(" ");
    const canChiNam = this.canChi.getCanChiNam(lunar.lunarYear);
    const canNamIndex = (lunar.lunarYear + 6) % 10;
    const canChiThang = this.canChi.getCanChiThang(canNamIndex, lunar.lunarMonth);
    const napAm = this.napAm.getNapAmSafe(canNgay, chiNgay);
    const nguHanhDG = this.nguHanh.danhGiaNguHanh(canNgay, chiNgay);
    const xh = this.xungHop.getXungHopValue(chiNgay);
    const lucDieuName = this.lucDieu.LUC_DIEU_THEO_CHI[chiNgay];
    const lucDieuDesc = this.lucDieu.LUC_DIEU[lucDieuName] || "";
    const gioHD_chis = this.GIO_HOANG_DAO[chiNgay] || [];
    const gioHD_text = gioHD_chis.map((c) => `${c} (${KHUNG_GIO[c] || ""})`);
    const nhi = this.nhiThapBatTu.getNhiThapBatTu(jdn);
    const truc = this.truc.getTrucByJdn(jdn);
    const banhTo = this.banhTo.buildBanhTo(canNgay, chiNgay, lunar.lunarDay);
    const ngocHapList = this.buildNgocHap(canNgay, chiNgay, lunar.lunarDay);
    const huongList = Object.entries(this.huongXuatHanh.getHuongXuatHanh(canNgay)).map(([x, y]) => ({ k: x, v: y }));
    const hacThan = this.huongXuatHanh.getHuongHacThan(canChiNgay);
    const gioXuatHanhNotes = this.gioXuatHanh.buildGioXuatHanhNotes();
    const tietKhi = this.tietKhi.getTietKhi(jdn);
    const [canThang, chiThang] = canChiThang.split(" ");
    const ngayHoangDao: any = this.ngayHoangDao.getHoangDaoStatus(chiNgay, chiThang);
    const saoTotXau = this.getSaoTotSaoXau(canNgay, chiNgay, chiThang, truc, nhi, ngayHoangDao);

    // const textSummary = [
    //   `Dương lịch: ${dd}/${mm}/${yy}`,
    //   `Âm lịch: ${lunar.lunarDay}/${lunar.lunarMonth}${lunar.lunarLeap ? " (Nhuận)" : ""}/${lunar.lunarYear}`,
    //   `Can-Chi ngày: ${canChiNgay}`,
    //   `Can-Chi tháng: ${canChiThang}`,
    //   `Can-Chi năm: ${canChiNam}`,
    //   `Nạp âm: ${napAm || "—"}`,
    //   `Ngũ hành đánh giá: ${nguHanhDG}`,
    //   `Lục Diệu: ${lucDieuName} — ${lucDieuDesc}`,
    //   `Giờ Hoàng Đạo: ${gioHD_text.join(", ") || "—"}`,
    //   `Nhị thập bát tú: ${nhi.key} — ${nhi.data.sao || ""} (${nhi.data.loai})`,
    //   `Trực: ${truc.key} — Nên: ${truc.data.tot} — Kiêng: ${truc.data.xau}`,
    //   `Bành Tổ (CAN ngày): ${canNgay} — ${banhTo.canStr || "—"}`,
    //   `Ngọc Hạp (tạm): ${ngocHapList.length ? ngocHapList.map((x) => x.k).join(", ") : "—"}`,
    //   `Hướng xuất hành (tham khảo): ${huongList.map((h) => `${h.k}: ${h.v}`).join("; ")}`,
    // ].join("\n\n");

    return {
      solarDate: `${dd}/${mm}/${yy}`,
      lunarDate: `${lunar.lunarDay}/${lunar.lunarMonth}`,
      lunarLeap: lunar.lunarLeap === 1,
      canChiNgay,
      canChiThang,
      canChiNam,
      napAm: napAm || "—",
      nguHanhDanhGia: nguHanhDG,
      nguHanhCan: `${canNgay} — ${NGU_HANH_CAN[canNgay]}`,
      nguHanhChi: `${chiNgay} — ${NGU_HANH_CHI[chiNgay]}`,
      xungHop: xh,
      lucDieuName,
      lucDieuDesc,
      gioHoangDao: gioHD_text,
      nhiThapBatTu: nhi,
      truc,
      banhTo,
      ngocHapList,
      huongList,
      hacThan,
      gioXuatHanhNotes,
      // textSummary,
      tietKhi,
      ngayHoangDao,
      saoTot: saoTotXau.saoTot, // TRẢ VỀ KẾT QUẢ
      saoXau: saoTotXau.saoXau, // TRẢ VỀ KẾT QUẢ
    };
  }

  get saoTotTieuBieu(): string[] {
    return Object.keys(this.NGOC_HAP_SAO_TOT_FULL).slice(0, 6);
  }

  get saoXauTieuBieu(): string[] {
    return Object.keys(this.NGOC_HAP_SAO_XAU_FULL).slice(0, 6);
  }

  // ----------------- MARK: Helpers -----------------
  private buildNgocHap(canNgay: string, chiNgay: string, lunarDay: number): NgocHapItem[] {
    let list: NgocHapItem[] = [];
    (this.SAO_TOT_CAN[canNgay] || []).forEach((k) => {
      if (this.NGOC_HAP_SAO_TOT_FULL[k]) list.push({ k, type: "good", v: this.NGOC_HAP_SAO_TOT_FULL[k] });
    });
    (this.SAO_XAU_CAN[canNgay] || []).forEach((k) => {
      if (this.NGOC_HAP_SAO_XAU_FULL[k]) list.push({ k, type: "bad", v: this.NGOC_HAP_SAO_XAU_FULL[k] });
    });
    (this.SAO_XAU_CHI[chiNgay] || []).forEach((k) => {
      if (this.NGOC_HAP_SAO_XAU_FULL[k]) list.push({ k, type: "bad", v: this.NGOC_HAP_SAO_XAU_FULL[k] });
    });
    const TN = [3, 7, 13, 18, 22, 27];
    if (TN.includes(lunarDay)) {
      list.push({ k: "Tam Nương", type: "bad", v: this.NGOC_HAP_SAO_XAU_FULL["Tam Nương"] });
    }
    const seen: Record<string, boolean> = {};
    list = list.filter((item) => {
      if (seen[item.k]) return false;
      seen[item.k] = true;
      return true;
    });
    return list;
  }

  // getCanChiNgay(jdn: number): string {
  //   const can = this.CAN[(jdn + 9) % 10];
  //   const chi = this.CHI[(jdn + 1) % 12];
  //   return `${can} ${chi}`;
  // }

  // getCanChiThang(canNamIndex: number, thangAm: number): string {
  //   // Index của Can tháng Dần (tháng 1 Âm lịch)
  //   const canThangDich = (canNamIndex * 2 + 2) % 10;

  //   // Can tháng = (Can tháng Dần + (tháng Âm - 1)) mod 10
  //   const canIndex = (canThangDich + (thangAm - 1)) % 10;

  //   // Chi tháng = (tháng Âm + 1) mod 12 (vì Chi Tý index 0, Chi Dần index 2)
  //   const chiIndex = (thangAm + 1) % 12;

  //   return `${this.CAN[canIndex]} ${this.CHI[chiIndex]}`;
  // }

  // getCanChiNam(nam: number): string {
  //   const can = this.CAN[(nam + 6) % 10];
  //   const chi = this.CHI[(nam + 8) % 12];
  //   return `${can} ${chi}`;
  // }

  // private danhGiaNguHanh(can: string, chi: string): string {
  //   const hanhCan = this.NGU_HANH_CAN[can];
  //   const hanhChi = this.NGU_HANH_CHI[chi];
  //   if (this.NGU_HANH_SINH[hanhCan] === hanhChi) return "Can sinh Chi - ngày rất tốt (cát).";
  //   if (this.NGU_HANH_SINH[hanhChi] === hanhCan) return "Chi sinh Can - ngày tốt.";
  //   if (this.NGU_HANH_KHAC[hanhCan] === hanhChi) return "Can khắc Chi - ngày xấu.";
  //   if (this.NGU_HANH_KHAC[hanhChi] === hanhCan) return "Chi khắc Can - ngày hung.";
  //   return "Can - Chi tương hòa - ngày bình ổn.";
  // }

  // private getNhiThapBatTu(jdn: number): NhiThapBatTuItem {
  //   const lon = this.sunLongitude(jdn);
  //   const adj = (lon - this.OFFSET_28_TU + 360) % 360;
  //   const idx = Math.floor(adj / 13.3333333);
  //   const key = this.NHI_THAP_BAT_TU_LIST[idx];
  //   return { key, data: this.NHI_THAP_BAT_TU[key] };
  // }

  /**
   * Hàm tổng hợp các sao Cát (Tốt) và Hung (Xấu) dựa trên Can Chi ngày, Trực, Hoàng Đạo/Hắc Đạo.
   * @param lunar Chi tiết ngày Âm lịch đã tính.
   * @returns { SaoDetail } Danh sách các sao tốt và sao xấu.
   */
  private getSaoTotSaoXau(
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
    if (this.SAO_TOT_CAN[canNgay]) {
      saoTot.push(...this.SAO_TOT_CAN[canNgay]);
    }
    if (this.SAO_XAU_CAN[canNgay]) {
      saoXau.push(...this.SAO_XAU_CAN[canNgay]);
    }

    // 2. Sao Tốt/Xấu theo Chi Ngày (SAO_TOT_CHI, SAO_XAU_CHI)
    if (this.SAO_TOT_CHI[chiNgay]) {
      saoTot.push(...this.SAO_TOT_CHI[chiNgay]);
    }
    if (this.SAO_XAU_CHI[chiNgay]) {
      saoXau.push(...this.SAO_XAU_CHI[chiNgay]);
    }

    // Sao Tốt/Xấu theo CHI THÁNG
    if (this.SAO_TOT_THANG[chiThang]) {
      saoTot.push(...this.SAO_TOT_THANG[chiThang]);
    }
    if (this.SAO_XAU_THANG[chiThang]) {
      saoXau.push(...this.SAO_XAU_THANG[chiThang]);
    }

    if (this.SAO_DAC_BIET[chiThang]) {
      saoTot.push(...this.SAO_DAC_BIET[chiThang]);
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

  // ----------------- MARK: Dữ liệu -----------------
  // Bản rút gọn
  // readonly NGAY_HOANG_DAO_THANG: Record<number, string[]> = {
  //   1: ["Tý", "Sửu", "Tỵ", "Mùi"], // Dần
  //   2: ["Dần", "Mão", "Mùi", "Dậu"], // Mão
  //   3: ["Thìn", "Tỵ", "Dậu", "Hợi"], // Thìn
  //   4: ["Ngọ", "Mùi", "Sửu", "Dậu"], // Tỵ
  //   5: ["Sửu", "Mão", "Thân", "Dậu"], // Ngọ
  //   6: ["Mão", "Tỵ", "Tuất", "Hợi"], // Mùi
  //   7: ["Tý", "Sửu", "Tỵ", "Mùi"], // Thân
  //   8: ["Dần", "Mão", "Mùi", "Dậu"], // Dậu
  //   9: ["Thìn", "Tỵ", "Dậu", "Hợi"], // Tuất
  //   10: ["Ngọ", "Mùi", "Sửu", "Dậu"], // Hợi (Tháng 10 Âm lịch)
  //   11: ["Sửu", "Mão", "Thân", "Dậu"], // Tý (Tháng 11 Âm lịch)
  //   12: ["Mão", "Tỵ", "Tuất", "Hợi"], // Sửu (Tháng 12 Âm lịch)
  // };

  // readonly NGAY_HAC_DAO_THANG: Record<number, string[]> = {
  //   1: ["Ngọ", "Mão", "Hợi", "Dậu"], // Dần
  //   2: ["Thân", "Tỵ", "Sửu", "Hợi"], // Mão
  //   3: ["Tuất", "Mùi", "Sửu", "Hợi"], // Thìn
  //   4: ["Tý", "Dậu", "Tỵ", "Mão"], // Tỵ
  //   5: ["Dần", "Hợi", "Mùi", "Tỵ"], // Ngọ
  //   6: ["Thìn", "Sửu", "Dậu", "Mùi"], // Mùi
  //   7: ["Ngọ", "Mão", "Hợi", "Dậu"], // Thân
  //   8: ["Thân", "Tỵ", "Sửu", "Hợi"], // Dậu
  //   9: ["Tuất", "Mùi", "Sửu", "Hợi"], // Tuất
  //   10: ["Tý", "Dậu", "Tỵ", "Mão"], // Hợi (Tháng 10 Âm lịch)
  //   11: ["Dần", "Hợi", "Mùi", "Tỵ"], // Tý (Tháng 11 Âm lịch)
  //   12: ["Thìn", "Sửu", "Dậu", "Mùi"], // Sửu (Tháng 12 Âm lịch)
  // };

  // Ví dụ về cách chuyển đổi từ Chi sang Index (Giả định: Dần=1, Mão=2,...)


  readonly GIO_HOANG_DAO: Record<string, string[]> = {
    Tý: ["Tý", "Sửu", "Mão", "Ngọ", "Thân", "Dậu"],
    Sửu: ["Dần", "Mão", "Tỵ", "Thân", "Tuất", "Hợi"],
    Dần: ["Tý", "Sửu", "Thìn", "Tỵ", "Mùi", "Tuất"],
    Mão: ["Tý", "Dần", "Mão", "Ngọ", "Mùi", "Dậu"],
    Thìn: ["Dần", "Thìn", "Tỵ", "Thân", "Dậu", "Hợi"],
    Tỵ: ["Sửu", "Thìn", "Ngọ", "Mùi", "Tuất", "Hợi"],
    Ngọ: ["Tý", "Sửu", "Mão", "Ngọ", "Thân", "Dậu"],
    Mùi: ["Dần", "Mão", "Tỵ", "Thân", "Tuất", "Hợi"],
    Thân: ["Tý", "Sửu", "Thìn", "Tỵ", "Mùi", "Tuất"],
    Dậu: ["Tý", "Dần", "Mão", "Ngọ", "Mùi", "Dậu"],
    Tuất: ["Dần", "Thìn", "Tỵ", "Thân", "Dậu", "Hợi"],
    Hợi: ["Sửu", "Thìn", "Ngọ", "Mùi", "Tuất", "Hợi"],
  };

 

  readonly NGAY_KY = {
    trungTang: "Kỵ chôn cất, cưới xin, xuất hành, xây nhà, xây mồ mả.",
    trungPhuc: "Kỵ chôn cất, cưới xin, xuất hành, xây nhà, xây mồ mả.",
    thapAcDaiBat: "10 ngày cực xấu, tuyệt kỵ việc lớn.",
  };

  readonly TRUNG_TANG = ["Nhâm Thân", "Giáp Thân", "Canh Thân", "Mậu Thân"];
  readonly TRUNG_PHUC = ["Quý Dậu", "Ất Dậu", "Tân Dậu", "Kỷ Dậu"];

  readonly BANH_TO: Record<string, string> = {
    Giáp: "“Giáp nhật bất khả thủ hành, xuất hành đa phong ba” - Không nên xuất hành tránh sóng gió.",
    Ất: "“Ất nhật bất khả tạo mộc, chủ phạm cô loan” - Tránh làm mộc kẻo cô độc.",
    Bính: "“Bính nhật bất khả hỏa táo, chủ táo bại” - Tránh nổi lửa lớn.",
    Đinh: "“Đinh nhật bất khả phụng sự, chủ đa thất tín” - Tránh cầu xin, dễ thất tín.",
    Mậu: "“Mậu nhật bất khả thủy công, chủ thất tài” - Kỵ làm việc sông nước.",
    Kỷ: "“Kỷ nhật bất khả khai thương, chủ thất lợi” - Kỵ mở kho, mở hàng.",
    Canh: "“Canh nhật bất khả giá thê, chủ tổn thất” - Kỵ cưới hỏi.",
    Tân: "“Tân nhật bất khả tầm y, chủ khẩu thiệt” - Kỵ xin việc dễ cãi vã.",
    Nhâm: "“Nhâm nhật bất ương thủy, nan canh đê phòng” - Kỵ tháo nước, hư đê điều.",
    Quý: "“Quý nhật bất vấn bốc, tự nhạ tai ương” - Kỵ gieo quẻ hỏi việc, dễ tai ương.",
    Tý: "“Tý nhật bất vấn bốc tự nhạ tai ương” - Kỵ gieo quẻ.",
    Sửu: "“Sửu nhật bất năng tác xa, chủ phá tài” - Tránh sửa xe, chế tạo.",
    Dần: "“Dần nhật bất khả táng môn, chủ bất an” - Kỵ mở cửa mộ.",
    Mão: "“Mão nhật bất khả kiến hỉ, chủ phá bại” - Kỵ mừng cưới.",
    Thìn: "“Thìn nhật bách sự bất thành” - Ngày hung, việc khó thành.",
    Tỵ: "“Tỵ nhật bất khả tác đạo, chủ tặc khởi” - Không nên đào đường.",
    Ngọ: "“Ngọ nhật bất khả tạo phòng, chủ đại hung” - Kỵ xây phòng ốc.",
    Mùi: "“Mùi nhật bất khả tạo ốc, chủ đại bại” - Kỵ xây nhà.",
    Thân: "“Thân nhật bất khả hôn nhân, chủ phân ly” - Kỵ cưới hỏi.",
    Dậu: "“Dậu nhật bất khả an tàm, chủ bất thành” - Kỵ nuôi tằm.",
    Tuất: "“Tuất nhật bất khả tế tự, chủ bất lợi” - Kỵ cúng tế.",
    Hợi: "“Hợi nhật bất khả khai trùng, chủ thất bại” - Kỵ khai kho, đào huyệt.",
  };

  

  readonly NHI_THAP_BAT_TU_KEY: string[] = [
    "Giác",
    "Cang",
    "Đê",
    "Phòng",
    "Tâm",
    "Vĩ",
    "Cơ",
    "Đẩu",
    "Ngưu",
    "Nữ",
    "Hư",
    "Nguy",
    "Thất",
    "Bích",
    "Khuê",
    "Lâu",
    "Vị",
    "Mão",
    "Tất",
    "Chủy",
    "Sâm",
    "Tỉnh",
    "Quỷ",
    "Liễu",
    "Tinh",
    "Trương",
    "Dực",
    "Chẩn",
  ];

  readonly NGOC_HAP_SAO_TOT_FULL: Record<string, string> = {
    "Thiên Đức": "Tốt mọi việc.",
    "Nguyệt Đức": "Tốt mọi việc.",
    "Thiên Quý": "Quý nhân phù trợ, cực tốt.",
    "Thiên Xá": "Tốt giải oan, giải nạn.",
    "Thiên Ân": "Cầu phúc, tế tự tốt.",
    "Thiên Phúc": "Tốt cho cưới hỏi, sinh con.",
    "Thiên Tài": "Cầu tài đại cát.",
    "Nguyệt Tài": "Cầu tài vừa phải.",
    "Thiên Hỷ": "Cưới hỏi đại cát.",
    "Phúc Sinh": "Tốt cho cầu phúc, cầu con.",
    "Sinh Khí": "Động thổ, khai trương cực tốt.",
    "Thiên Mã": "Xuất hành tốt.",
    "Dịch Mã": "Xuất hành, giao dịch tốt.",
    "Tứ Phú": "Cầu tài tốt.",
    "Kim Quỹ": "Khai trương, mở kho tốt.",
    "Ngọc Đường": "Tốt việc quan, bổ nhiệm.",
  };

  readonly NGOC_HAP_SAO_XAU_FULL: Record<string, string> = {
    "Trùng Tang": "Rất xấu, kỵ cưới, an táng.",
    "Trùng Phục": "Kỵ cưới hỏi, xây nhà.",
    "Bạch Hổ": "Xấu khi an táng.",
    "Huyết Sát": "Xấu về máu huyết.",
    "Tam Nương": "6 ngày cực xấu: mùng 3,7,13,18,22,27",
    "Sát Chủ": "Xấu khi động thổ.",
    "Không Phòng": "Xấu khi cưới hỏi.",
    "Nguyệt Hư": "Xấu mọi việc.",
    "Nguyệt Hình": "Xấu, dễ kiện tụng.",
    "Nguyệt Phá": "Xấu khi xây dựng.",
    "Thổ Cấm": "Xấu phá thổ.",
    "Thiên Cương": "Đại hung.",
    "Địa Tặc": "Dễ mất mát.",
    "Ngũ Quỷ": "Đại hung.",
    "Hoang Vu": "Xấu mọi việc lớn.",
    "Lục Bất Thành": "Việc khó thành.",
    "Ly Sàng": "Xấu về hôn nhân.",
    "Cô Thần": "Xấu cưới hỏi.",
    "Quả Tú": "Xấu cưới hỏi.",
    "Hỏa Tai": "Dễ cháy nổ.",
    "Tán Tận": "Mất tiền của.",
    "Đại Không Vong": "Đại hung.",
  };

  // Sao Tốt theo Chi Tháng (Nguyệt Kiến Thần Sát)
  // Đây là bộ dữ liệu đầy đủ hơn, bao gồm cả những sao như Thiên Quý (thường đi kèm với Nguyệt Đức/Thiên Đức)
  readonly SAO_TOT_THANG: Record<string, string[]> = {
    Dần: ["Nguyệt Đức", "Thiên Đức", "Thiên Ân", "Sanh Khí", "Thiên Y", "Tứ Tương", "Thiên Phúc"],
    Mão: ["Thiên Đức Hợp", "Nguyệt Đức Hợp", "Thiên Mã", "Nguyệt Tài"],
    Thìn: ["Âm Đức", "Nguyệt Ân", "Phúc Đức", "Thiên Hỷ"],
    Tỵ: ["Nguyệt Đức", "Thiên Đức", "Cát Khánh", "Ích Hậu", "Thiên Mã"],
    Ngọ: ["Thiên Đức Hợp", "Nguyệt Đức Hợp", "Nguyệt Không", "Thiên Quý", "Thiên Phúc"],
    Mùi: ["Thánh Tâm", "Tam Hợp", "Thiên Hỷ", "Mẫu Thương"],
    Thân: ["Nguyệt Đức", "Thiên Đức", "Thiên Mã", "Nguyệt Tài", "Âm Đức"],
    Dậu: ["Thiên Đức Hợp", "Nguyệt Đức Hợp", "Thiên Ân", "Sanh Khí"],
    Tuất: ["Phúc Đức", "Thiên Quý", "Thiên Hỷ", "Nguyệt Ân"],
    // Tháng Hợi thường có các sao lớn như Thiên Đức, Nguyệt Đức
    Hợi: ["Thiên Đức", "Nguyệt Đức", "Thiên Mã", "Cát Khánh", "Nguyệt Ân", "Thiên Quý"],
    Tý: ["Thiên Đức Hợp", "Nguyệt Đức Hợp", "Tứ Tương", "Duyệt Tài"],
    Sửu: ["Nguyệt Đức", "Thiên Đức", "Thiên Ân", "Lộc Khố"],
  };

  // Sao Xấu theo Chi Tháng (Nguyệt Kiến Thần Sát)
  readonly SAO_XAU_THANG: Record<string, string[]> = {
    Dần: ["Nguyệt Hình", "Tam Tang", "Cửu Khảo"],
    Mão: ["Nguyệt Phá", "Thiên Lao", "Tứ Phục"],
    Thìn: ["Nguyệt Hình", "Thiên Ngục", "Đại Họa"],
    Tỵ: ["Tử Thần", "Tiểu Hao", "Huyền Vũ"],
    Ngọ: ["Nguyệt Phá", "Thiên Ôn", "Ngũ Quỷ"],
    Mùi: ["Nguyệt Hình", "Thiên Hình", "Bát Tổ"],
    Thân: ["Đại Hao", "Kiếp Sát", "Trùng Tang"],
    Dậu: ["Thiên Ôn", "Nguyệt Phá", "Lục Bại"],
    Tuất: ["Địa Tang", "Tam Tai", "Câu Trận"],
    Hợi: ["Nguyệt Phá", "Tử Khí", "Thiên Tặc", "Nguyệt Hình"],
    Tý: ["Đại Hao", "Tiểu Hao", "Thiên Lại"],
    Sửu: ["Nguyệt Phá", "Tử Thần", "Hoang Vu"],
  };

  readonly SAO_TOT_CAN: Record<string, string[]> = {
    Giáp: ["Thiên Đức", "Nguyệt Đức", "Dịch Mã"],
    Ất: ["Thiên Ân", "Tứ Tương", "Thiên Phúc"],
    Bính: ["Thiên Phúc", "Lộc Khố", "Giải Thần"],
    Đinh: ["Thiên Hỷ", "Kim Quỹ", "Nguyệt Tài"],
    Mậu: ["Thiên Ân", "Thiên Quý", "Thiên Quan"],
    Kỷ: ["Nguyệt Đức", "Nguyệt Ân", "Thánh Tâm"],
    Canh: ["Thiên Quý", "Thiên Phúc", "Nguyệt Đức Hợp"],
    Tân: ["Thiên Đức", "Âm Đức", "Nguyệt Ân"],
    Nhâm: ["Lục Hợp", "Thiên Quý", "Tam Hợp"],
    Quý: ["Thiên Phúc", "Kim Quỹ", "Thiên Giải"],
  };

  readonly SAO_XAU_CAN: Record<string, string[]> = {
    Giáp: ["Đại Hao", "Kiếp Sát", "Trùng Tang"],
    Ất: ["Trùng Phục", "Lục Bại", "Câu Trận"],
    Bính: ["Quan Phù", "Tứ Kích", "Thiên Hỏa"],
    Đinh: ["Thiên Hỏa", "Ly Sàng", "Không Phòng"],
    Mậu: ["Huyết Sát", "Câu Trần", "Hoang Vu"],
    Kỷ: ["Nguyệt Hình", "Chu Tước", "Bát Tổ"],
    Canh: ["Tứ Ly", "Lục Hại", "Thiên Cương"],
    Tân: ["Trùng Tang", "Bạch Hổ", "Nguyệt Hư"],
    Nhâm: ["Bát Tổ", "Kiếp Sát", "Thiên Ôn"],
    Quý: ["Không Phòng", "Ly Sàng", "Huyết Chi"],
  };

  // Cập nhật SAO_TOT_CHI: Bổ sung Thiên Thụy, U Vi Tinh, Yếu Yên vào các Chi Ngày tương ứng
  // Trong file lich.service.ts
  readonly SAO_TOT_CHI: Record<string, string[]> = {
    Tý: ["Cát Khánh", "Thiên Phúc", "Thiên Tài", "Dịch Mã", "Thiên Giải"],
    Sửu: ["Nguyệt Đức Hợp", "Thiên Quan", "Phúc Sinh", "Thiên Y"],
    Dần: ["Sinh Khí", "Nguyệt Tài", "Tam Hợp", "Thiên Đức Hợp"],
    Mão: ["Thiên Đức Hợp", "Ích Hậu", "Giải Thần", "Nguyệt Tài"],
    Thìn: ["Phúc Đức", "Thiên Hỷ", "Nguyệt Ân", "Thiên Quan"],
    Tỵ: ["Thiên Y", "Giải Thần", "Lộc Khố", "Thiên Phúc"],
    Ngọ: ["Nguyệt Đức", "Thiên Quý", "Quan Lộc", "Thiên Phúc"],
    Mùi: ["Tam Hợp", "Cát Khánh", "Duyệt Tài", "Thiên Quý"],
    Thân: ["Âm Đức", "Lộc Mã", "Thiên Hỷ", "Thiên Thụy", "U Vi Tinh"], // <-- ĐÃ THÊM THIÊN THỤY VÀ U VI TINH
    Dậu: ["Thiên Phúc", "Kim Đường", "Minh Đường", "Yếu Yên"],
    Tuất: ["Thiên Ân", "Phúc Tinh", "Phổ Hộ", "Tục Thế"],
    Hợi: ["Thái Âm", "Nguyệt Đức", "Thiên Hỷ", "Thiên Ân"],
  };

  readonly SAO_XAU_CHI: Record<string, string[]> = {
    Tý: ["Bệnh Phù", "Trùng Tang", "Huyết Sát"],
    Sửu: ["Nguyệt Hư", "Hư Không", "Hoang Vu"],
    Dần: ["Lục Bại", "Phục Nhật", "Nguyệt Hình"],
    Mão: ["Nguyệt Hình", "Xích Khẩu", "Nguyệt Phá"],
    Thìn: ["Thiên Họa", "Tam Quan", "Quan Phù"],
    Tỵ: ["Đại Hao", "Tử Thần", "Xích Khẩu"],
    Ngọ: ["Phục Đoạn", "Đại Sát", "Trùng Phục"],
    Mùi: ["Nguyệt Sát", "Thiên Tặc", "Nguyệt Hư"],
    Thân: ["Bạch Hổ", "Kiếp Sát", "Thiên Lao"],
    Dậu: ["Thiên Hình", "Hại Chủ", "Kiếp Sát"],
    Tuất: ["Câu Trần", "Nguyệt Sát", "Trùng Tang"],
    Hợi: ["Tử Khí", "Sát Chủ", "Âm Dương Sát"],
  };

  // Trong file lich.service.ts
  // Sao Sát Cống và Yếu Yên thường là sao đặc biệt theo Chi Tháng
  readonly SAO_DAC_BIET: Record<string, string[]> = {
    // Sát Cống (Giải Thần) theo Tháng:
    Hợi: ["Sát Cống", "Yếu Yên"], // <-- Bổ sung Yếu Yên
    Mão: ["Sát Cống"],
    Mùi: ["Sát Cống"],
    Tỵ: ["Sát Cống"],
    Dậu: ["Sát Cống"],
    Sửu: ["Sát Cống"],
    // Yếu Yên: thường đi kèm Thiên Quý hoặc Thiên Y trong tháng Ngọ/Dậu
    Ngọ: ["Yếu Yên"],
  };

  readonly OFFSET_28_TU = -90;
}

