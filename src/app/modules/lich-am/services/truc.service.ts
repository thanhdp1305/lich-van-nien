import { Injectable } from "@angular/core";

export type TrucItem = { key: string; data: { moTa: string, tot: string; xau: string } };

@Injectable({ providedIn: "root" })
export class Truc {
  readonly TRUC_ORDER = ["Kiến", "Trừ", "Mãn", "Bình", "Định", "Chấp", "Phá", "Nguy", "Thành", "Thu", "Khai", "Bế"];
  readonly TRUC: Record<string, { moTa: string; tot: string; xau: string }> = {
    Kiến: {
      moTa: "KIẾN nghi xuất hành, bất khả khai thương - Ngày Trực KIẾN nên du lịch, không được khai trương",
      tot: "Khai trương, nhậm chức, cưới hỏi, trồng cây, xuất hành tốt.",
      xau: "Kỵ động thổ, chôn cất, đào giếng, lợp nhà.",
    },
    Trừ: {
      moTa: "TRỪ khả phục dược, châm cứu diệc lương - Ngày Trực TRỪ nên dùng thuốc, châm cứu cũng hay",
      tot: "Tốt cho phá dỡ, bỏ cái cũ để làm cái mới.",
      xau: "Kỵ cưới hỏi và xây dựng.",
    },
    Mãn: {
      moTa: "MÃN khả tứ thị, phục dược tao ương - Ngày Trực MÃN dạo phố phường, uống thuốc thì khổ",
      tot: "Tốt cho cưới hỏi, cầu tài, cầu phúc.",
      xau: "Kỵ kiện tụng.",
    },
    Bình: {
      moTa: "BÌNH khả đồ nê, an ky cát xương - Ngày Trực BÌNH hợp mầu đen, đi bằng phương tiện",
      tot: "Tốt cho việc nhỏ, bình ổn.",
      xau: "Kỵ việc lớn.",
    },
    Định: {
      moTa: "ĐỊNH thả tiến súc, nhập học danh dương - Ngày Trực  ĐỊNH mua gia súc, nhập trường nổi danh",
      tot: "Tốt cho cưới hỏi, cầu tài.",
      xau: "Kỵ kiện tụng, động thổ.",
    },
    Chấp: {
      moTa: "CHẤP khả bộ tróc, đạo tặc nan tàng - Ngày Trực CHẤP bắt kẻ gian, trộm khó che giấu",
      tot: "Tốt cho xây cất, cầu phúc.",
      xau: "Kỵ xuất hành.",
    },
    Phá: {
      moTa: "PHÁ nghi trì bệnh, tất chủ an khang -  Ngày Trực PHÁ nên trị bệnh, chủ sẽ mạnh khỏe",
      tot: "Tốt cho phá bỏ, dỡ nhà.",
      xau: "Xấu cho mọi việc lớn.",
    },
    Nguy: {
      moTa: "NGUY khả bộ ngư, bất lợi hành thuyền - Ngày Trực NGUY nên bắt cá, chẳng nên đi thuyền",
      tot: "Không có việc tốt rõ ràng.",
      xau: "Rất xấu, đại kỵ cưới hỏi.",
    },
    Thành: {
      moTa: "THÀNH khả nhập học, tranh tụng bất cường - Ngày Trực THÀNH nên ghi danh, tránh xa kiện tụng",
      tot: "Cầu tài, cưới hỏi, xây cất, khai trương.",
      xau: "Kỵ kiện tụng.",
    },
    Thu: {
      moTa: "THU nghi nạp tài, tức kị an táng - Ngày Trực THU nên nhập tiền, cần tránh an táng",
      tot: "Thu hoạch, nhập kho.",
      xau: "Kỵ xuất tiền.",
    },
    Khai: {
      moTa: "KHAI khả cầu trì, châm cứu bất tường - Ngày Trực KHAI mở cửa quan, chẳng nên châm cứu",
      tot: "Khai trương, mở hàng, xuất hành.",
      xau: "Kỵ an táng.",
    },
    Bế: {
      moTa: "BẾ đạm thụ tạo, chỉ hứa an khang - Ngày Trực BẾ không xây mới, chỉ lập kế hoạch",
      tot: "Không có việc tốt.",
      xau: "Đại hung, tránh mọi việc quan trọng.",
    },
  };
  
  readonly TRUC_OFFSET = 1;

  getTrucByJdn(jdn: number): TrucItem {
    const idx = (((jdn + this.TRUC_OFFSET) % 12) + 12) % 12;
    const key = this.TRUC_ORDER[idx];
    return { key, data: this.TRUC[key] };
  }
}
