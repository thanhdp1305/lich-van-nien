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
import { NgocHap, NgocHapItem } from "./ngoc-hap.service";
import { Sao } from "./sao.service";

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
    private banhTo: BanhTo,
    private ngocHap: NgocHap,
    private sao: Sao
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
    const ngocHapList = this.ngocHap.buildNgocHap(canNgay, chiNgay, lunar.lunarDay);
    const huongList = Object.entries(this.huongXuatHanh.getHuongXuatHanh(canNgay)).map(([x, y]) => ({ k: x, v: y }));
    const hacThan = this.huongXuatHanh.getHuongHacThan(canChiNgay);
    const gioXuatHanhNotes = this.gioXuatHanh.buildGioXuatHanhNotes();
    const tietKhi = this.tietKhi.getTietKhi(jdn);
    const [canThang, chiThang] = canChiThang.split(" ");
    const ngayHoangDao: any = this.ngayHoangDao.getHoangDaoStatus(chiNgay, chiThang);
    const saoTotXau = this.sao.getSaoTotSaoXau(canNgay, chiNgay, chiThang, truc, nhi, ngayHoangDao);

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

  // ----------------- MARK: Dữ liệu -----------------
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
  readonly OFFSET_28_TU = -90;
}

