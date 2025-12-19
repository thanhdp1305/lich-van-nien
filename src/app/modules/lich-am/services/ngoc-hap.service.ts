import { Injectable } from "@angular/core";
import { SAO_TOT_CAN, SAO_XAU_CAN, SAO_XAU_CHI } from "../data";
import { NGOC_HAP_SAO_TOT_FULL, NGOC_HAP_SAO_XAU_FULL } from "../data/NGOC_HAP";

export type NgocHapItem = { k: string; type: "good" | "bad"; v: string };

@Injectable({ providedIn: "root" })
export class NgocHap {

  buildNgocHap(canNgay: string, chiNgay: string, lunarDay: number): NgocHapItem[] {
    let list: NgocHapItem[] = [];
    (SAO_TOT_CAN[canNgay] || []).forEach((k) => {
      if (NGOC_HAP_SAO_TOT_FULL[k]) list.push({ k, type: "good", v: NGOC_HAP_SAO_TOT_FULL[k] });
    });
    (SAO_XAU_CAN[canNgay] || []).forEach((k) => {
      if (NGOC_HAP_SAO_XAU_FULL[k]) list.push({ k, type: "bad", v: NGOC_HAP_SAO_XAU_FULL[k] });
    });
    (SAO_XAU_CHI[chiNgay] || []).forEach((k) => {
      if (NGOC_HAP_SAO_XAU_FULL[k]) list.push({ k, type: "bad", v: NGOC_HAP_SAO_XAU_FULL[k] });
    });
    const TN = [3, 7, 13, 18, 22, 27];
    if (TN.includes(lunarDay)) {
      list.push({ k: "Tam Nương", type: "bad", v: NGOC_HAP_SAO_XAU_FULL["Tam Nương"] });
    }
    const seen: Record<string, boolean> = {};
    list = list.filter((item) => {
      if (seen[item.k]) return false;
      seen[item.k] = true;
      return true;
    });
    return list;
  }
}
