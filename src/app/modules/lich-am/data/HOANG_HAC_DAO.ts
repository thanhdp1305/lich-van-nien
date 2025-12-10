export const DS_CHI = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];

export const DS_SAO_HOANG_DAO: string[] = ["Thanh Long", "Minh Đường", "Kim Quý", "Kim Đường", "Ngọc Đường", "Tư Mệnh"];

export const DS_SAO_HAC_DAO: string[] = ["Thiên Hình", "Chu Tước", "Bạch Hổ", "Thiên Lao", "Nguyên Vũ", "Câu Trận"];

// // Chu kỳ 12 Sao Hoàng/Hắc Đạo
export const CHU_KY_LAP_CUA_SAO_HOANG_HAC_DAO = [
  "Thanh Long",
  "Minh Đường",
  "Thiên Hình",
  "Chu Tước",
  "Kim Quý",
  "Kim Đường",
  "Bạch Hổ",
  "Ngọc Đường",
  "Thiên Lao",
  "Nguyên Vũ",
  "Tư Mệnh",
  "Câu Trận",
];

// Bản đồ xác định Chi Ngày bắt đầu (tại đó giờ Tý là Thanh Long) theo Chi Tháng
export const MAP_CHI_THANG_TO_START_DAY_CHI: Record<string, string> = {
  Dần: "Tý",
  Thân: "Tý", // Tháng 1, 7 -> Ngày Tý
  Thìn: "Thìn",
  Tuất: "Thìn", // Tháng 3, 9 -> Ngày Thìn
  Tỵ: "Ngọ",
  Hợi: "Ngọ", // Tháng 4, 10 -> Ngày Ngọ
  Sửu: "Tuất",
  Mùi: "Tuất", // Tháng 12, 6 -> Ngày Tuất
  Mão: "Dần",
  Dậu: "Dần", // Tháng 2, 8 -> Ngày Dần
  Tý: "Thân",
  Ngọ: "Thân", // Tháng 11, 5 -> Ngày Thân
};
