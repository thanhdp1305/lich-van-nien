import { Injectable } from "@angular/core";
import { mod } from "../../shared/utils";

export type NhiThapBatTuItem = {
  key: string;
  data: { sao: string; loai: string; moTa: string; nen: string; ky: string; ngoaiLe?: string };
};

@Injectable({ providedIn: "root" })
export class NhiThapBatTu {
    readonly NHI_THAP_BAT_TU_LIST = [
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
  readonly NHI_THAP_BAT_TU: Record<string, any> = {
    Giác: { sao: "Giác Mộc Giao", loai: "Tốt", moTa: "Tướng tinh con rồng, chủ trị ngày thứ 1.", nen: "Tốt cho mọi việc.", ky: "Kỵ chôn cất.", ngoaiLe: "Tại Dần, Ngọ, Tuất mọi việc tốt." },
    Cang: { sao: "Cang Kim Long", loai: "Xấu", moTa: "Tướng tinh con rồng vàng.", nen: "Không có việc gì thuận lợi.", ky: "Kỵ mọi việc lớn.", ngoaiLe: "Không có ngoại lệ." },
    Đê: { sao: "Đê Thổ Tử", loai: "Xấu", moTa: "Tướng tinh con dê.", nen: "Tốt cho xây dựng.", ky: "Kỵ chôn cất.", ngoaiLe: "" },
    Phòng: { sao: "Phòng Nhật Thố", loai: "Tốt", moTa: "Tướng tinh con thỏ.", nen: "Tốt cho cưới hỏi.", ky: "Kỵ an táng.", ngoaiLe: "" },
    Tâm: { sao: "Tâm Nguyệt Hồ", loai: "Xấu", moTa: "Tướng tinh con cáo.", nen: "Không nên làm việc lớn.", ky: "Kỵ chôn cất và cưới hỏi.", ngoaiLe: "" },
    Vĩ: { sao: "Vĩ Hỏa Hổ", loai: "Tốt", moTa: "Tướng tinh con hổ.", nen: "Tốt về mọi mặt.", ky: "Kỵ chôn cất.", ngoaiLe: "" },
    Cơ: { sao: "Cơ Thổ Kê", loai: "Tốt", moTa: "Tướng tinh con gà.", nen: "Tốt cho xây dựng và cưới gả.", ky: "Không kỵ gì.", ngoaiLe: "" },
    Đẩu: { sao: "Đẩu Mộc Giải", loai: "Xấu", moTa: "Tướng tinh con rái cá.", nen: "Không có việc gì thuận lợi.", ky: "Kỵ xuất hành.", ngoaiLe: "" },
    Ngưu: { sao: "Ngưu Kim Ngưu", loai: "Xấu", moTa: "Tướng tinh con trâu.", nen: "Không tốt cho việc lớn.", ky: "Kỵ an táng.", ngoaiLe: "" },
    Nữ: { sao: "Nữ Thổ Bức", loai: "Xấu", moTa: "Tướng tinh con dơi.", nen: "Không nên làm việc trọng đại.", ky: "Kỵ cưới hỏi.", ngoaiLe: "" },
    Hư: { sao: "Hư Nhật Thử", loai: "Xấu", moTa: "Tướng tinh con chuột.", nen: "Không nên làm gì.", ky: "Đại kỵ chôn cất.", ngoaiLe: "" },
    Nguy: { sao: "Nguy Nguyệt Yến", loai: "Xấu", moTa: "Tướng tinh con chim yến.", nen: "Không nên khởi sự.", ky: "Kỵ cưới hỏi.", ngoaiLe: "" },
    Thất: { sao: "Thất Hỏa Trư", loai: "Tốt", moTa: "Tướng tinh con heo.", nen: "Tốt cho cưới hỏi, xây dựng.", ky: "Kỵ chôn cất.", ngoaiLe: "" },
    Bích: { sao: "Bích Thủy Du", loai: "Xấu", moTa: "Tướng tinh con cá.", nen: "Không nên làm việc lớn.", ky: "Kỵ khai trương.", ngoaiLe: "" },
    Khuê: { sao: "Khuê Mộc Lang", loai: "Tốt", moTa: "Tướng tinh con chó sói.", nen: "Tốt cho mọi việc.", ky: "Kỵ chôn cất.", ngoaiLe: "" },
    Lâu: { sao: "Lâu Kim Cẩu", loai: "Tốt", moTa: "Tướng tinh con chó.", nen: "Tốt cho khởi sự.", ky: "Không kỵ.", ngoaiLe: "" },
    Vị: { sao: "Vị Thổ Trĩ", loai: "Tốt", moTa: "Tướng tinh con gà rừng.", nen: "Tốt mọi việc.", ky: "Kỵ an táng.", ngoaiLe: "" },
    Mão: { sao: "Mão Nhật Kê", loai: "Xấu", moTa: "Tướng tinh con gà.", nen: "Không nên làm việc lớn.", ky: "Kỵ cưới hỏi.", ngoaiLe: "" },
    Tất: { sao: "Tất Nguyệt Ô", loai: "Tốt", moTa: "Tướng tinh con quạ.", nen: "Tốt cho việc nhỏ.", ky: "Kỵ chôn cất.", ngoaiLe: "" },
    Chủy: { sao: "Chủy Hỏa Hầu", loai: "Xấu", moTa: "Tướng tinh con khỉ.", nen: "Không nên khởi sự.", ky: "Kỵ khai trương.", ngoaiLe: "" },
    Sâm: { sao: "Sâm Thủy Viên", loai: "Xấu", moTa: "Tướng tinh con vượn.", nen: "Không tốt.", ky: "Kỵ làm nhà.", ngoaiLe: "" },
    Tỉnh: { sao: "Tỉnh Mộc Hổ", loai: "Tốt", moTa: "Tướng tinh con hổ.", nen: "Tốt cho xây dựng.", ky: "Kỵ chôn cất.", ngoaiLe: "" },
    Quỷ: { sao: "Quỷ Kim Dương", loai: "Xấu", moTa: "Tướng tinh con dê.", nen: "Không làm việc lớn.", ky: "Kỵ cưới hỏi.", ngoaiLe: "" },
    Liễu: { sao: "Liễu Thủy Hầu", loai: "Xấu", moTa: "Tướng tinh con khỉ nước.", nen: "Không tốt.", ky: "Kỵ chôn cất.", ngoaiLe: "" },
    Tinh: { sao: "Tinh Nhật Mã", loai: "Tốt", moTa: "Tướng tinh con ngựa.", nen: "Tốt cho mọi việc.", ky: "Kỵ an táng.", ngoaiLe: "" },
    Trương: { sao: "Trương Nguyệt Lộc", loai: "Tốt", moTa: "Tướng tinh con nai.", nen: "Tốt cho cầu tài.", ky: "Không kỵ.", ngoaiLe: "" },
    Dực: { sao: "Dực Hỏa Xà", loai: "Xấu", moTa: "Tướng tinh con rắn.", nen: "Nếu cắt áo sẽ sinh tài.", ky: "Kỵ chôn cất, xây nhà, cưới hỏi.", ngoaiLe: "Tại Thân - Tý - Thìn rất tốt." },
    Chẩn: { sao: "Chẩn Thổ Trĩ", loai: "Tốt", moTa: "Tướng tinh con gà.", nen: "Tốt cho mọi việc.", ky: "Kỵ mai táng.", ngoaiLe: "" },
  };

  getNhiThapBatTu(jdn: number): NhiThapBatTuItem {
    // 1. Chuyển đổi JDN sang số nguyên ngày (Julian Day Number tính từ trưa)
    // Thêm 0.5 để khớp với lịch dân dụng bắt đầu từ nửa đêm
    const dayInt = Math.floor(jdn + 0.5);

    // 2. Sử dụng công thức modulo 28 với Offset là 3
    // Công thức: (JDN + Offset) % 28
    const idx = mod(dayInt + 11, 28);
    const key = this.NHI_THAP_BAT_TU_LIST[idx];

    return { 
        key, 
        data: this.NHI_THAP_BAT_TU[key] 
    };
  }
}