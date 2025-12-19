import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class LucDieu {
  readonly LUC_DIEU: Record<string, string> = {
    "Đại An": "Tốt. Mọi việc đều hanh thông, đi lại thuận lợi, cầu tài lộc tốt.",
    "Lưu Niên": "Xấu. Dễ gặp rủi ro, hao tài, thị phi.",
    "Tốc Hỷ": "Rất tốt. Có tin vui, cưới hỏi, khai trương đều đẹp.",
    "Xích Khẩu": "Xấu về kiện tụng, thị phi, tranh cãi.",
    "Tiểu Cát": "Rất đẹp. Mọi sự may mắn, tài lộc.",
    "Không Vong": "Hung. Việc khó thành, gặp trở ngại, tiền tài dễ mất.",
  };

  readonly LUC_DIEU_THEO_CHI: Record<string, string> = {
    Tý: "Đại An",
    Sửu: "Lưu Niên",
    Dần: "Tốc Hỷ",
    Mão: "Xích Khẩu",
    Thìn: "Tiểu Cát",
    Tỵ: "Không Vong",
    Ngọ: "Đại An",
    Mùi: "Lưu Niên",
    Thân: "Tốc Hỷ",
    Dậu: "Xích Khẩu",
    Tuất: "Tiểu Cát",
    Hợi: "Không Vong",
  };
}