import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class BanhTo {
  // Theo THẬP THIÊN CAN 十个日名用十天干表示
  readonly BACH_KY_CAN: Record<string, string> = {
    Giáp: "GIÁP bất khai thương tài vật hao vong - Ngày Can Giáp không nên mở kho, tiền của hao mất",
    Ất: "ẤT bất tải thực thiên chu bất trưởng - Ngày Can Ất không nên gieo trồng, ngàn gốc không lên",
    Bính: "BÍNH bất tu táo tất kiến hỏa ương - Ngày Can Bính không nên sửa bếp, sẽ bị hỏa tai",
    Đinh: "ĐINH bất thế đầu đầu chủ sanh sang - Ngày Can Đinh không nên cắt tóc, đầu sinh ra nhọt",
    Mậu: "MẬU bất thụ điền điền chủ bất tường - Ngày Can Mậu không nên nhận đất, chủ không được lành",
    Kỷ: "KỶ bất phá khoán nhị chủ tịnh vong - Ngày Can Kỷ không nên phá khoán, cả 2 chủ đều mất",
    Canh: "CANH bất kinh lạc chức cơ hư trướng - Ngày Can Canh không nên quay tơ, cũi dệt hư hại ngang",
    Tân: "TÂN bất hợp tương chủ nhân bất thường - Ngày Can Tân không nên trộn tương, chủ không được nếm qua",
    Nhâm: "NHÂM bất ương thủy nan canh đê phòng - Ngày Can Nhâm không nên tháo nước, khó canh phòng đê",
    Quý: "QUÝ bất từ tụng lí nhược địch cường - Ngày Can Quý không nên kiện tụng, ta lý yếu địch mạnh",
  };

  readonly BACH_KY_CHI: Record<string, string> = {
    Tý: "TÝ bất vấn bốc tự nhạ tai ương - Ngày Chi Tý không nên gieo quẻ hỏi, tự rước lấy tai ương",
    Sửu: "SỬU bất quan đới chủ bất hoàn hương - Ngày Chi Sửu không nên đi nhận quan, chủ sẽ không hồi hương",
    Dần: "DẦN bất tế tự quỷ thần bất thường - Ngày Chi Dần không nên tế tự, quỷ thần không bình thường.",
    Mão: "MÃO bất xuyên tỉnh tuyền thủy bất hương - Ngày Chi Mão không nên đào giếng, nước sẽ không trong lành",
    Thìn: "THÌN bất khốc khấp tất chủ trọng tang - Ngày Chi Thìn không nên khóc lóc, chủ sẽ có trùng tang",
    Tỵ: "TỴ bất viễn hành tài vật phục tàng - Ngày Chi Tỵ không nên đi xa tiền của mất mát",
    Ngọ: "NGỌ bất thiêm cái thất chủ canh trương - Ngày Chi Ngọ không nên làm lợp mái nhà, chủ sẽ phải làm lại",
    Mùi: "MÙI bất phục dược độc khí nhập tràng - Ngày Chi Mùi không nên uống thuốc, khí độc ngấm vào ruột",
    Thân: "THÂN bất an sàng quỷ túy nhập phòng - Ngày Chi Thân không nên kê giường, quỷ ma vào phòng",
    Dậu: "DẬU bất hội khách tân chủ hữu thương - Ngày Chi Dậu không nên hội khách, tân chủ có hại",
    Tuất: "TUẤT bất cật khuyển tác quái thượng sàng - Ngày Chi Tuất không nên ăn chó, quỉ quái lên giường",
    Hợi: "HỢI bất giá thú tất chủ phân trương - Ngày Chi Hợi không nên làm cưới gả, sẽ ly biệt cưới khác.",
  };

  readonly BACH_KY_LUNAR: Record<number, string> = {
    1: "Sơ nhất bất nhận tài vật - Kỵ nhận tiền của, dễ gặp điều không may.",
    2: "Sơ nhị bất giá thú - Kỵ cưới hỏi, hôn nhân không thuận.",
    3: "Sơ tam bất an táng - Kỵ an táng, dễ sinh chuyện rắc rối.",
    4: "Sơ tứ bất xướng tụng - Kỵ kiện tụng, dễ thua thiệt.",
    5: "Sơ ngũ bất tập chúng - Kỵ tụ tập đông người, dễ sinh tranh chấp.",
    6: "Sơ lục bất an trạch - Kỵ sửa nhà, chuyển nhà, dễ gặp hung hiểm.",
    7: "Sơ thất bất khốc tang - Kỵ khóc tang, dễ tổn khí.",
    8: "Sơ bát bất hành phòng - Kỵ chuyện phòng the, dễ bất lợi sức khỏe.",
    9: "Sơ cửu bất yến ẩm - Kỵ tiệc tùng, dễ sinh khẩu thiệt.",
    10: "Sơ thập bất khai thị - Kỵ mở cửa hàng, kinh doanh dễ thất bại.",
    11: "Thập nhất bất dụng y - Kỵ dùng thuốc, dễ bệnh thêm.",
    12: "Thập nhị bất tế tự - Kỵ cúng tế, không linh nghiệm.",
    13: "Thập tam bất khởi tạo - Kỵ xây dựng, dễ gặp trắc trở.",
    14: "Thập tứ bất tằng phiên - Kỵ bắt đầu việc mới, dễ thay đổi bất lợi.",
    15: "Thập ngũ bất khai kho - Kỵ mở kho xuất hàng, dễ hao hụt.",
    16: "Thập lục bất nghiệm bốc - Kỵ gieo quẻ bói toán, dễ sai lệch.",
    17: "Thập thất bất năng ngự - Kỵ lên xe ngựa/đi xa, dễ gặp khó khăn.",
    18: "Thập bát bất mưu viễn hành - Kỵ tính chuyện đi xa, không thành.",
    19: "Thập cửu bất an môn hộ - Kỵ sửa cửa, dễ gây tổn hại.",
    20: "Nhị thập bất tích ốc - Kỵ cất nóc, hoàn thiện nhà.",
    21: "Nhị thập nhất bất quy lộc - Kỵ nhận chức, nhận lộc, dễ mất uy tín.",
    22: "Nhị thập nhị bất ẩm tửu - Kỵ uống rượu, dễ sinh họa.",
    23: "Nhị thập tam bất động thổ - Kỵ động thổ, dễ xảy ra tai họa.",
    24: "Nhị thập tứ bất yết kiến - Kỵ gặp gỡ quan quyền, dễ sinh phiền phức.",
    25: "Nhị thập ngũ bất khốc tang - Kỵ khóc tang, hao tổn tinh thần.",
    26: "Nhị thập lục bất nạp tài - Kỵ nhận tiền của, dễ mất mát.",
    27: "Nhị thập thất bất yến ẩm - Kỵ ăn uống linh đình, dễ xung đột.",
    28: "Nhị thập bát bất hoàn nhân - Kỵ hoàn trả đồ vật hay tiền bạc.",
    29: "Nhị thập cửu bất tụ hội - Kỵ tụ họp, dễ xảy ra bất hòa.",
    30: "Tam thập bất quy khách - Kỵ đón khách, dễ gặp điều phiền toái.",
  };

  buildBanhTo(
    canNgay: string,
    chiNgay: string,
    lunarDay: number,
  ): { canStr: string; chiStr: string; lunarStr: string } {
    return {
      canStr: this.BACH_KY_CAN[canNgay] || "Không có thông tin cụ thể.",
      chiStr: this.BACH_KY_CHI[chiNgay] || "Không có thông tin cụ thể.",
      lunarStr: this.BACH_KY_LUNAR[lunarDay] || "Không có thông tin cụ thể.",
    };
  }
}
