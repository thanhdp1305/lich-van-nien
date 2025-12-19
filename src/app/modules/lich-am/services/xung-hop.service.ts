import { Injectable } from "@angular/core";

export type XungHopValue = {
  lucHop?: string;
  tamHop?: string[];
  xung?: string;
  hinh?: string;
  hai?: string;
  pha?: string;
  tuyet?: string;
};

@Injectable({ providedIn: "root" })
export class XungHop {
  readonly LUC_HOP: Record<string, string> = {
    Tý: "Sửu",
    Sửu: "Tý",
    Dần: "Hợi",
    Mão: "Tuất",
    Thìn: "Dậu",
    Tỵ: "Thân",
    Ngọ: "Mùi",
    Mùi: "Ngọ",
    Thân: "Tỵ",
    Dậu: "Thìn",
    Tuất: "Mão",
    Hợi: "Dần",
  };
  readonly TAM_HOP: Record<string, string[]> = {
    Tý: ["Thìn", "Thân"],
    Sửu: ["Tỵ", "Dậu"],
    Dần: ["Ngọ", "Tuất"],
    Mão: ["Mùi", "Hợi"],
    Thìn: ["Tý", "Thân"],
    Tỵ: ["Sửu", "Dậu"],
    Ngọ: ["Dần", "Tuất"],
    Mùi: ["Mão", "Hợi"],
    Thân: ["Tý", "Thìn"],
    Dậu: ["Sửu", "Tỵ"],
    Tuất: ["Dần", "Ngọ"],
    Hợi: ["Mão", "Mùi"],
  };
  readonly XUNG: Record<string, string> = {
    Tý: "Ngọ",
    Sửu: "Mùi",
    Dần: "Thân",
    Mão: "Dậu",
    Thìn: "Tuất",
    Tỵ: "Hợi",
    Ngọ: "Tý",
    Mùi: "Sửu",
    Thân: "Dần",
    Dậu: "Mão",
    Tuất: "Thìn",
    Hợi: "Tỵ",
  };
  readonly HAI: Record<string, string> = {
    Tý: "Mùi",
    Sửu: "Ngọ",
    Dần: "Tỵ",
    Mão: "Thìn",
    Thìn: "Mão",
    Tỵ: "Dần",
    Ngọ: "Sửu",
    Mùi: "Tý",
    Thân: "Hợi",
    Dậu: "Tuật",
    Tuất: "Dậu",
    Hợi: "Thân",
  };
  readonly PHA: Record<string, string> = {
    Tý: "Dậu",
    Sửu: "Tuất",
    Dần: "Hợi",
    Mão: "Ngọ",
    Thìn: "Sửu",
    Tỵ: "Thân",
    Ngọ: "Mão",
    Mùi: "Thìn",
    Thân: "Tỵ",
    Dậu: "Tý",
    Tuất: "Sửu",
    Hợi: "Dần",
  };
  readonly TUYET: Record<string, string> = {
    Tý: "Tỵ",
    Sửu: "Ngọ",
    Dần: "Mùi",
    Mão: "Thân",
    Thìn: "Dậu",
    Tỵ: "Tuất",
    Ngọ: "Hợi",
    Mùi: "Tý",
    Thân: "Sửu",
    Dậu: "Dần",
    Tuất: "Mão",
    Hợi: "Thìn",
  };
  
  getXungHopValue(chi: string): XungHopValue {
    return {
      lucHop: this.LUC_HOP[chi],
      tamHop: this.TAM_HOP[chi],
      xung: this.XUNG[chi],
      hinh: this.HAI[chi],
      hai: this.HAI[chi],
      pha: this.PHA[chi],
      tuyet: this.TUYET[chi],
    };
  }
}
