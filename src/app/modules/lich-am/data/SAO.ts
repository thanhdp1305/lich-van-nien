// Sao Tốt theo Chi Tháng (Nguyệt Kiến Thần Sát)
// Đây là bộ dữ liệu đầy đủ hơn, bao gồm cả những sao như Thiên Quý (thường đi kèm với Nguyệt Đức/Thiên Đức)
export const SAO_TOT_THANG: Record<string, string[]> = {
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
export const SAO_XAU_THANG: Record<string, string[]> = {
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

export const SAO_TOT_CAN: Record<string, string[]> = {
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

export const SAO_XAU_CAN: Record<string, string[]> = {
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
export const SAO_TOT_CHI: Record<string, string[]> = {
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

export const SAO_XAU_CHI: Record<string, string[]> = {
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
export const SAO_DAC_BIET: Record<string, string[]> = {
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
