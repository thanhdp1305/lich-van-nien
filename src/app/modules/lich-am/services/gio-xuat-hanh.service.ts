import { Injectable } from "@angular/core";
import { KHUNG_GIO } from "../data";

export type GioXuatHanhItem = { chi: string; range: string; note: string };

@Injectable({ providedIn: "root" })
export class GioXuatHanh {
  readonly GIO_XUAT_HANH_LY_THUAN_PHONG: Record<string, string> = {
    Tý: "Cầu tài không lợi, hay gặp chuyện trái ý. Dễ gặp nạn. Nếu làm việc quan trọng phải cúng tế.",
    Sửu: "Mọi việc tốt lành, cầu tài được. Xuất hành hướng Tây Nam càng tốt.",
    Dần: "Mưu sự khó thành, cầu tài mờ mịt. Kiện cáo nên hoãn. Dễ mất tiền.",
    Mão: "Tin vui sắp đến. Cầu tài đi hướng Nam rất tốt. Chăn nuôi thuận lợi.",
    Thìn: "Dễ sinh tranh cãi, gặp chuyện đói kém. Người ra đi nên hoãn lại.",
    Tỵ: "Giờ rất tốt, gặp nhiều may mắn. Kinh doanh có lợi, gia đạo hòa hợp.",
    Ngọ: "Cầu tài không lợi, hay gặp thất ý. Người đi xa hay gặp nạn.",
    Mùi: "Mọi việc tốt lành. Xuất hành Tây Nam đại cát.",
    Thân: "Mưu việc khó thành. Kiện cáo nên hoãn. Dễ mất của.",
    Dậu: "Tin vui đến. Cầu lộc đi hướng Nam rất tốt.",
    Tuất: "Cãi vã, thị phi, không nên làm việc quan trọng.",
    Hợi: "Rất tốt, kinh doanh thuận lợi, người đi xa sắp về.",
  };

  buildGioXuatHanhNotes(): GioXuatHanhItem[] {
    return Object.entries(this.GIO_XUAT_HANH_LY_THUAN_PHONG).map(([chi, note]) => ({
      chi,
      range: KHUNG_GIO[chi] || "",
      note,
    }));
  }
}
