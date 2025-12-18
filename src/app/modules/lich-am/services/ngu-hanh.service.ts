import { Injectable } from '@angular/core';
import { NGU_HANH_CAN, NGU_HANH_CHI, NGU_HANH_KHAC, NGU_HANH_SINH } from '../data';

@Injectable({ providedIn: 'root' })
export class NguHanh {
  danhGiaNguHanh(can: string, chi: string): string {
    const hanhCan = NGU_HANH_CAN[can];
    const hanhChi = NGU_HANH_CHI[chi];
    if (NGU_HANH_SINH[hanhCan] === hanhChi) return 'Can sinh Chi - ngày rất tốt (cát).';
    if (NGU_HANH_SINH[hanhChi] === hanhCan) return 'Chi sinh Can - ngày tốt.';
    if (NGU_HANH_KHAC[hanhCan] === hanhChi) return 'Can khắc Chi - ngày xấu.';
    if (NGU_HANH_KHAC[hanhChi] === hanhCan) return 'Chi khắc Can - ngày hung.';
    return 'Can - Chi tương hòa - ngày bình ổn.';
  }
}
