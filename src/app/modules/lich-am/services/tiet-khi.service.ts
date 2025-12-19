import { Injectable } from "@angular/core";
import { AmLich } from "./am-lich.service";

@Injectable({ providedIn: "root" })
export class TietKhi {
  readonly TIET_KHI_DATA: { goc: number; ten: string }[] = [
    { goc: 315, ten: "Lập Xuân" },
    { goc: 330, ten: "Vũ Thủy" },
    { goc: 345, ten: "Kinh Trập" },
    { goc: 0, ten: "Xuân Phân" },
    { goc: 15, ten: "Thanh Minh" },
    { goc: 30, ten: "Cốc Vũ" },
    { goc: 45, ten: "Lập Hạ" },
    { goc: 60, ten: "Tiểu Mãn" },
    { goc: 75, ten: "Mang Chủng" },
    { goc: 90, ten: "Hạ Chí" },
    { goc: 105, ten: "Tiểu Thử" },
    { goc: 120, ten: "Đại Thử" },
    { goc: 135, ten: "Lập Thu" },
    { goc: 150, ten: "Xử Thử" },
    { goc: 165, ten: "Bạch Lộ" },
    { goc: 180, ten: "Thu Phân" },
    { goc: 195, ten: "Hàn Lộ" },
    { goc: 210, ten: "Sương Giáng" },
    { goc: 225, ten: "Lập Đông" },
    { goc: 240, ten: "Tiểu Tuyết" },
    { goc: 255, ten: "Đại Tuyết" },
    { goc: 270, ten: "Đông Chí" },
    { goc: 285, ten: "Tiểu Hàn" },
    { goc: 300, ten: "Đại Hàn" },
  ];

  constructor(private amLich: AmLich) {}

  // Lấy thông tin tiết khí
  getTietKhi(jdn: number): string {
    const lon = this.amLich.sunLongitude(jdn); // Lấy Hoàng Kinh Độ (0 - 360)
    let closestTietKhi = "";
    let minDiff = 360;

    // Sắp xếp lại Tiết Khí theo góc tăng dần để duyệt hiệu quả hơn
    const sortedTietKhi = [...this.TIET_KHI_DATA].sort((a, b) => a.goc - b.goc);

    // Duyệt qua 24 tiết khí để tìm tiết khí mà ngày JDN đang nằm trong đó
    for (let i = 0; i < sortedTietKhi.length; i++) {
      const current = sortedTietKhi[i];
      const next = sortedTietKhi[(i + 1) % sortedTietKhi.length];

      const currentGoc = current.goc;
      let nextGoc = next.goc;

      // Xử lý trường hợp vòng qua 360/0 độ (Lập Xuân đến Xuân Phân)
      if (nextGoc <= currentGoc) {
        nextGoc += 360;
      }

      // Nếu Hoàng Kinh Độ nằm giữa góc hiện tại và góc tiếp theo
      if (lon >= currentGoc && lon < nextGoc) {
        return current.ten; // Trả về tên tiết khí hiện tại
      }

      // Trường hợp lon > 315 và lon < 360 (vùng của Lập Xuân)
      if (lon >= 315 && lon < 360 && current.ten === "Lập Xuân") {
        return current.ten;
      }
    }

    // Xử lý trường hợp 0-15 độ (Xuân Phân) nếu không bắt được trong vòng lặp (lon < 15)
    if (lon >= 0 && lon < 15) {
      return "Xuân Phân";
    }

    return "Không xác định"; // Trường hợp dự phòng
  }
}
